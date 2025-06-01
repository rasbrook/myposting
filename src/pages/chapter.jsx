import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase, supabaseTeach } from "../../supabase";

const Chapter = () => {
    const { chapter: chapterId, courseid: courseId } = useParams();
    const navigate = useNavigate();
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [c, setCha] = useState({ content: { content: [] } })
    const [contentid, setContentid] = useState()
    const [newContent, setNewContent] = useState({
        note: '',
        Video: '',
        name: '',
        chapter_id: chapterId,
        course_id: courseId,
        instructer_id: 4,
        description: ''
    });

    const getchapter = async () => {
        let { data: chapter, error } = await supabase
            .from('chapter')
            .select("*")
            .eq('id', chapterId)
        setCha(chapter[0])

    }
    console.log(c)

    const [contentList, setContentList] = useState([]);

    useEffect(() => {
        getContentList();
        getchapter()
    }, []);

    const getContentList = async () => {
        try {
            setLoading(true);
            const { data: contentData, error } = await supabaseTeach
                .from('content')
                .select("*")
                .eq('chapter_id', chapterId);

            if (error) throw error;
            setContentList(contentData);
        } catch (error) {
            console.error("Error fetching content:", error);
        } finally {
            setLoading(false);
        }
    };
    console.log(newContent)
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const { data, error } = await supabaseTeach.storage
                .from("video")
                .upload(`${file.name}_${Date.now()}`, file);

            if (error) throw error;

            setNewContent(prev => ({
                ...prev,
                Video: file.name
            }));
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    };

    const handlePdfChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const { data, error } = await supabaseTeach.storage
                .from("pdf")
                .upload(`${file.name}_${Date.now()}`, file);

            if (error) throw error;

            setNewContent(prev => ({
                ...prev,
                note: file.name
            }));
        } catch (error) {
            console.error("Error uploading PDF:", error);
        }
    };


    const handleUpload = async () => {
        try {
            // 1. Insert the new content
            const { data: newContentData, error: contentError } = await supabaseTeach
                .from('content')
                .insert([newContent])
                .select();
            setContentid(newContentData.id)

            if (contentError) throw contentError;

            const newContentId = newContentData[0].id;

            // 2. Update the chapter's content array
            const { data: chapterData, error: chapterError } = await supabase
                .from('chapter')
                .update({
                    content: { ...c.content.content, contentid }
                })
                .eq('id', chapterId)
                .single();

            if (chapterError) throw chapterError;

            // 3. Refresh the content list
            await getContentList();

            // 4. Reset the form
            setNewContent({
                note: '',
                Video: '',
                name: '',
                chapter_id: chapterId,
                course_id: courseId,
                instructer_id: 4,
                description: ''
            });

            setCreating(false);
            alert("Content added successfully!");
        } catch (error) {
            console.error("Error adding content:", error);
            alert("Failed to add content. Please try again.");
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            {!creating ? (
                <>
                    <h2>Contents for Course: {courseId}</h2>
                    <div className="content-list">
                        {contentList.map((content) => (
                            <div key={content.id}>
                                <h3 onClick={() => navigate(`/course/chapter/content/${content.id}`)}>{content.name}</h3>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setCreating(true)}>Add New Content</button>
                </>
            ) : (
                <div className="create-content">
                    <h2>Add New Content</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="name">Content Title:</label>
                            <input
                                type="text"
                                id="name"
                                value={newContent.name}
                                onChange={(e) => setNewContent({ ...newContent, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Content Description:</label>
                            <input
                                type="text"
                                id="description"
                                value={newContent.description}
                                onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Upload Video:</label>
                            <input type="file" accept="video/*" onChange={handleFileChange} />
                        </div>
                        <div className="form-group">
                            <label>Upload PDF:</label>
                            <input type="file" accept="application/pdf" onChange={handlePdfChange} />
                        </div>
                        <button type="button" onClick={handleUpload}>Upload Content</button>
                        <button type="button" onClick={() => setCreating(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chapter;
