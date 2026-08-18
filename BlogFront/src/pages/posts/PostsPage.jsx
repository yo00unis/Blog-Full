import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../services/postService';

export default function PostsPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(6);
    const [totalPages, setTotalPages] = useState(1);

    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts(pageNumber);
    }, [pageNumber]);

    const fetchPosts = async (page) => {
        try {
            setLoading(true);
            const response = await postService.getAllPosts(page, pageSize);

            console.log('API full response:', response);

            // لو الـ Axios Interceptor بيحط الـ Body جوا response.data
            // ولو مش بيحطه، بنتعامل مع الـ response مباشرة
            const responseData = response.data || response;

            if (responseData && responseData.items) {
                const rawItems = responseData.items;

                // استبعاد الـ medias من كل بوست
                const postsWithoutMedia = rawItems.map(({ medias, ...rest }) => rest);

                setPosts(postsWithoutMedia);
                setTotalPages(responseData.totalPages || 1);
            } else {
                setPosts([]);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async (id) => {
        try {
            await postService.deletePost(id);
            setDeleteConfirmId(null);
            fetchPosts(pageNumber);
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: '#666', fontSize: '18px', fontFamily: 'sans-serif' }}>Loading posts...</div>;

    return (
        <div style={{ maxWidth: '100%', padding: '0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

            {/* Upper Content */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: '0', color: '#1a1a1a', fontSize: '26px', fontWeight: '700' }}>All Posts</h2>
                </div>

                {posts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px', border: '1px solid #eaeaea', color: '#666' }}>
                        No posts found.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                        {posts.map(post => (
                            <div key={post.id} style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 10px 0', color: '#1a1a1a', fontSize: '18px', fontWeight: '600' }}>{post.title}</h3>

                                    <div
                                        dangerouslySetInnerHTML={{ __html: post.content ? (post.content.substring(0, 90) + '...') : '' }}
                                        style={{ color: '#555', fontSize: '14px', marginBottom: '15px', lineHeight: '1.5' }}
                                    />
                                    {/* تم حذف كود عرض الـ Medias تماماً من هنا بناءً على طلبك */}
                                </div>

                                <div>
                                    <div style={{ color: '#888', fontSize: '12px', marginBottom: '15px' }}>
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </div>

                                    {deleteConfirmId === post.id ? (
                                        <div style={{ background: '#fff8e6', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #ffeeba' }}>
                                            <p style={{ fontSize: '13px', margin: '0 0 10px 0', color: '#856404', fontWeight: '500' }}>Delete this post?</p>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => handleConfirmDelete(post.id)}
                                                    style={{ flex: 1, background: '#dc3545', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirmId(null)}
                                                    style={{ flex: 1, background: '#6c757d', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
                                                >
                                                    No
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => navigate(`/posts/${post.id}`)}
                                                style={{ flex: 1, background: '#0d6efd', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                                            >
                                                View Details
                                            </button>

                                            <button
                                                onClick={() => setDeleteConfirmId(post.id)}
                                                style={{ background: '#fff', color: '#dc3545', border: '1px solid #dc3545', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination في أسفل الصفحة تماماً */}
            {posts.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '40px', paddingBottom: '20px', borderTop: '1px solid #eaeaea', paddingTop: '20px' }}>
                    <button
                        disabled={pageNumber === 1}
                        onClick={() => setPageNumber(prev => prev - 1)}
                        style={{ padding: '8px 16px', background: pageNumber === 1 ? '#f1f1f1' : '#fff', color: pageNumber === 1 ? '#aaa' : '#333', border: '1px solid #ced4da', borderRadius: '8px', cursor: pageNumber === 1 ? 'not-allowed' : 'pointer', fontWeight: '500', fontSize: '14px' }}
                    >
                        Previous
                    </button>

                    <span style={{ fontWeight: '600', color: '#444', fontSize: '14px' }}>
                        Page {pageNumber} of {totalPages}
                    </span>

                    <button
                        disabled={pageNumber >= totalPages}
                        onClick={() => setPageNumber(prev => prev + 1)}
                        style={{ padding: '8px 16px', background: pageNumber >= totalPages ? '#f1f1f1' : '#fff', color: pageNumber >= totalPages ? '#aaa' : '#333', border: '1px solid #ced4da', borderRadius: '8px', cursor: pageNumber >= totalPages ? 'not-allowed' : 'pointer', fontWeight: '500', fontSize: '14px' }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}