import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabaseTeach } from "../../supabase";

const AddQuestions = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [content, setContent] = useState({});
    const [newQuestionType, setNewQuestionType] = useState('multiple');

    // Get content details
    const getContent = async () => {
        try {
            const { data: contentData, error: contentError } = await supabaseTeach
                .from('content')
                .select("*")
                .eq('id', id);

            if (contentError) throw contentError;
            if (contentData && contentData.length > 0) {
                setContent(contentData[0]);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    // Get questions from both tables
    const getQuestions = async () => {
        try {
            // Get multiple choice questions
            const { data: multiChoiceData, error: multiChoiceError } = await supabaseTeach
                .from('q_multi_choice')
                .select("*")
                .eq('content_id', id);

            // Get short answer questions
            const { data: shortAnswerData, error: shortAnswerError } = await supabaseTeach
                .from('q_short_answer')
                .select("*")
                .eq('content_id', id);

            if (multiChoiceError || shortAnswerError) throw new Error('Failed to fetch questions');

            // Combine and format both types of questions
            const combinedQuestions = [];
            if (multiChoiceData) {
                combinedQuestions.push(...multiChoiceData.map(question => ({
                    ...question,
                    type: 'multiple',
                    choice: JSON.parse(question.choice)
                })));
            }
            if (shortAnswerData) {
                combinedQuestions.push(...shortAnswerData.map(question => ({
                    ...question,
                    type: 'short',
                    answer: question.answer ?? '', // Ensure answer is never undefined
                    explanation: question.explanation ?? '' // Ensure explanation is never undefined
                })));
            }

            setQuestions(combinedQuestions);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Add new question
    const handleAddQuestion = () => {
        const newQuestion = {
            id: Date.now().toString(),
            question: '',
            type: newQuestionType,
            choice: newQuestionType === 'multiple' ? { A: '', B: '', C: '', D: '' } : null,
            answer: '',
            explanation: '',
            content_id: id
        };
        setQuestions(prev => [newQuestion, ...prev]);
    };

    // Handle changes to question fields
    const handleQuestionChange = (field, value, questionId) => {
        setQuestions(prevQuestions => {
            return prevQuestions.map(question => {
                if (question.id === questionId) {
                    if (field === 'choice') {
                        return {
                            ...question,
                            choice: {
                                ...question.choice,
                                [value.field]: value.value
                            }
                        };
                    }
                    return { ...question, [field]: value };
                }
                return question;
            });
        });
    };

    // Delete a question
    const handleDeleteQuestion = async (questionId, questionType) => {
        try {
            if (confirm('Are you sure you want to delete this question?')) {
                const table = questionType === 'multiple' ? 'q_multi_choice' : 'q_short_answer';
                const { error } = await supabaseTeach
                    .from(table)
                    .delete()
                    .eq('id', questionId);

                if (error) throw error;

                setQuestions(prev => prev.filter(q => q.id !== questionId));
                alert('Question deleted successfully!');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    // Save a question
    const handleSaveQuestion = async (question) => {
        try {
            const table = question.type === 'multiple' ? 'q_multi_choice' : 'q_short_answer';
            const dataToSave = {
                id: question.id,
                question: question.question,
                content_id: id,
                answer: question.answer,
                explanation: question.explanation
            };

            if (question.type === 'multiple') {
                dataToSave.choice = JSON.stringify(question.choice);
            }

            const { data, error } = await supabaseTeach
                .from(table)
                .upsert(dataToSave)
                .eq('id', question.id);

            if (error) throw error;

            alert('Question saved successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    // Save all questions
    const handleSaveAll = async () => {
        try {
            for (const question of questions) {
                await handleSaveQuestion(question);
            }
            alert('All questions saved successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        getContent();
        getQuestions();
    }, []);

    if (loading) {
        return <div>Loading..</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container" style={{ padding: '20px' }}>
            <div className="row">
                <div className="col-md-12">
                    <h1>Questions for Content {content.name}</h1>
                    <div className="card mb-4">
                        <div className="card-body">
                            <h4>Content Details:</h4>
                            <p><strong>Video:</strong> {content.video}</p>
                            <p><strong>Chapter ID:</strong> {content.chapter_id}</p>
                            <p><strong>Course ID:</strong> {content.course_id}</p>
                            <p><strong>Description:</strong> {content.description}</p>
                            <p><strong>Note:</strong> {content.note}</p>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Add New Question Type:</label>
                        <select
                            className="form-select"
                            value={newQuestionType}
                            onChange={(e) => setNewQuestionType(e.target.value)}
                        >
                            <option value="multiple">Multiple Choice</option>
                            <option value="short">Short Answer</option>
                        </select>
                        <button
                            className="btn btn-primary mt-2"
                            onClick={handleAddQuestion}
                        >
                            Add New Question
                        </button>
                    </div>

                    <button
                        className="btn btn-success mb-3"
                        onClick={handleSaveAll}
                    >
                        Save All Changes
                    </button>

                    {questions.map((question, index) => (
                        <div key={question.id} className="mb-5 p-3 border rounded shadow">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div>
                                    <h4>Question {index + 1}</h4>
                                    <span className="badge bg-primary ms-2">
                                        {question.type === 'multiple' ? 'Multiple Choice' : 'Short Answer'}
                                    </span>
                                </div>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteQuestion(question.id, question.type)}
                                >
                                    Delete
                                </button>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Question</label>
                                <textarea
                                    className="form-control"
                                    value={question.question || ''}
                                    onChange={(e) => handleQuestionChange('question', e.target.value, question.id)}
                                />
                            </div>

                            {question.type === 'multiple' && (
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Choice A</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={question.choice?.A || ''}
                                            onChange={(e) => handleQuestionChange(
                                                'choice',
                                                { field: 'A', value: e.target.value },
                                                question.id
                                            )}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Choice B</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={question.choice?.B || ''}
                                            onChange={(e) => handleQuestionChange(
                                                'choice',
                                                { field: 'B', value: e.target.value },
                                                question.id
                                            )}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Choice C</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={question.choice?.C || ''}
                                            onChange={(e) => handleQuestionChange(
                                                'choice',
                                                { field: 'C', value: e.target.value },
                                                question.id
                                            )}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Choice D</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={question.choice?.D || ''}
                                            onChange={(e) => handleQuestionChange(
                                                'choice',
                                                { field: 'D', value: e.target.value },
                                                question.id
                                            )}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Answer</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={question.answer || ''}
                                        onChange={(e) => handleQuestionChange('answer', e.target.value, question.id)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Explanation</label>
                                    <textarea
                                        className="form-control"
                                        value={question.explanation || ''}
                                        onChange={(e) => handleQuestionChange('explanation', e.target.value, question.id)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate(-1)}
                    >
                        Back to Content
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddQuestions;
