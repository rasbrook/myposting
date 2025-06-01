
import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabase";

const Course = () => {
    const course_id = useParams()
    const nav = useNavigate()
    const [chapters, setChapters] = useState([])
    const [loading, setLoading] = useState(false)
    console.log(course_id)
    const get_chapters = async () => {
        setLoading(true)
        console.log(course_id.course)
        let { data: chapter, error } = await supabase
            .from('chapter')
            .select("*")
            .eq('cource_id', course_id.course)
        console.log(error)
        console.log(chapter)
        setChapters(chapter)
        setLoading(false)
    }
    useEffect(() => {
        get_chapters()

    }, [])

    if (loading) {
        return <div>loading</div>
    }
    console.log(chapters)
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {
                chapters.map((item) => (
                    <div style={{ margin: 10 }}>
                        <button onClick={() => nav(`/course/${course_id.course}/${item.id}`)}>
                            {item.name}
                        </button>
                    </div>
                ))

            }

        </div>
    );
};

export default Course;
