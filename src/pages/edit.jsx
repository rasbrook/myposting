import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase, supabaseTeach } from "../../supabase";

const Edit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getContent = async () => {
        try {
            const { data, error } = await supabaseTeach
                .from('content')
                .select("*")
                .eq('id', id);

            if (error) throw error;

            if (data && data.length > 0) {
                setContent({
                    video: data[0].video,
                    chapter_id: data[0].chapter_id,
                    course_id: data[0].course_id,
                    description: data[0].description,
                    note: data[0].note,
                    name: data[0].name
                });
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await supabaseTeach
                .from('content')
                .update({
                    video: content.video,
                    chapter_id: content.chapter_id,
                    course_id: content.course_id,
                    description: content.description,
                    note: content.note,
                    name: content.name
                })
                .eq('id', id);

            if (error) throw error;

            if (data) {
                alert('Content updated successfully!');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this content?')) {
            try {
                const { data, error } = await supabaseTeach
                    .from('content')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                if (data) {
                    alert('Content deleted successfully!');
                    navigate('/content');
                }
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleNavigateToQuestions = () => {
        navigate(`/content/${id}/questions`);
    };

    useEffect(() => {
        getContent();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container" style={{ padding: '20px' }}>
            <h1>Edit Content</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleUpdate}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={content.name || ''}
                            onChange={(e) => setContent({ ...content, name: e.target.value })}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Video</label>
                        <input
                            type="url"
                            className="form-control"
                            value={content.video || ''}
                            onChange={(e) => setContent({ ...content, video: e.target.value })}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Chapter ID</label>
                        <input
                            type="number"
                            className="form-control"
                            value={content.chapter_id || ''}
                            onChange={(e) => setContent({ ...content, chapter_id: e.target.value })}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Course ID</label>
                        <input
                            type="number"
                            className="form-control"
                            value={content.course_id || ''}
                            onChange={(e) => setContent({ ...content, course_id: e.target.value })}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            value={content.description || ''}
                            onChange={(e) => setContent({ ...content, description: e.target.value })}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Note</label>
                        <input
                            type="text"
                            className="form-control"
                            value={content.note || ''}
                            onChange={(e) => setContent({ ...content, note: e.target.value })}
                        />
                    </div>
                </div>
                <div className="d-flex gap-2 mt-4">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleNavigateToQuestions}
                        disabled={loading}
                    >
                        Go to Questions
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Edit;
