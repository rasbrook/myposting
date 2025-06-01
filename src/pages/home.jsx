
import React, { useEffect, useState } from "react";
import { supabase, supabaseTeach } from "../../supabase";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [course, setCourse] = useState([])
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()
    const getcourse = async () => {
        setLoading(true)


        let { data: Courses, error } = await supabase
            .from('Courses')
            .select('*')
        // console.log(Courses)
        setCourse(Courses)
        setLoading(false)


    }

    useEffect(() => {
        getcourse()

    }, [])
    console.log(course)

    if (loading) {
        return <><h1>loading</h1></>
    }
    return (
        <div>
            {course.map((item) =>
            (
                <button onClick={() => nav(`/course/${item.id}`)}>{item.title}</button>
            ))
            }
        </div>
    );
};

export default Home;
