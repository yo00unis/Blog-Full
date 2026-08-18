import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { postService } from '../../services/postService';
import { uploadService } from '../../services/uploadService';

export default function PostDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [newFiles, setNewFiles] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPostDetails();
    }, [id]);

    const fetchPostDetails = async () => {
        try {
            setLoading(true);
            const response = await postService.getPostById(id);
            const postData = response.data || response;
            setPost(postData);
            setTitle(postData.title);
            setContent(postData.content);
        } catch (error) {
            console.error('Error fetching post details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('Title and content cannot be empty.');
            return;
        }

        try {
            setSaving(true);
            let updatedMedias = [...(post.medias || [])];

            if (newFiles.length > 0) {
                for (let i = 0; i < newFiles.length; i++) {
                    const file = newFiles[i];
                    const uploadedFileName = await uploadService.uploadImage(file);
                    
                    updatedMedias.push({
                        url: uploadedFileName,
                        mediaType: file.type.startsWith('image') ? 'Image' : 'File'
                    });
                }
            }

            const updateData = { title, content, medias: updatedMedias };
            await postService.updatePost(id, updateData);

            setIsEditing(false);
            setNewFiles([]);
            fetchPostDetails();
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteMedia = (mediaIndex) => {
        const updatedMedias = post.medias.filter((_, index) => index !== mediaIndex);
        setPost({ ...post, medias: updatedMedias });
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: '#666', fontSize: '18px' }}>Loading post details...</div>;
    if (!post) return <div style={{ textAlign: 'center', padding: '100px', color: '#666', fontSize: '18px' }}>Post not found.</div>;

    return (
        <div style={{ maxWidth: '850px', margin: '40px auto', padding: '0 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            
            {/* Header Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <button 
                    onClick={() => navigate(-1)}
                    style={{ background: '#f8f9fa', color: '#333', border: '1px solid #ced4da', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
                >
                    ← Back
                </button>

                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        style={{ background: '#0d6efd', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', boxShadow: '0 2px 4px rgba(13, 110, 253, 0.2)' }}
                    >
                        Edit Post
                    </button>
                )}
            </div>

            {/* Main Card */}
            <div style={{ background: '#fff', padding: '35px', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                {!isEditing ? (
                    /* --- View Mode --- */
                    <div>
                        <h1 style={{ marginTop: '0', color: '#1a1a1a', fontSize: '28px', marginBottom: '10px' }}>{post.title}</h1>
                        <div style={{ color: '#888', fontSize: '14px', marginBottom: '25px' }}>
                            Published on {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>

                        <div style={{ height: '1px', background: '#f0f0f0', marginBottom: '25px' }} />

                        <div 
                            dangerouslySetInnerHTML={{ __html: post.content }} 
                            style={{ lineHeight: '1.7', color: '#333', fontSize: '16px', marginBottom: '35px' }}
                        />

                        {post.medias && post.medias.length > 0 && (
                            <div>
                                <h3 style={{ fontSize: '18px', color: '#333', marginBottom: '15px' }}>Attached Media</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                                    {post.medias.map((media, index) => (
                                        <div key={index} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #eaeaea', background: '#f9f9f9' }}>
                                            <img 
                                                src={media.url} 
                                                alt="media" 
                                                style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* --- Edit Mode --- */
                    <form onSubmit={handleUpdatePost}>
                        <h2 style={{ marginTop: '0', marginBottom: '25px', color: '#1a1a1a', fontSize: '22px' }}>Edit Post</h2>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444', fontSize: '14px' }}>Title</label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '15px', outline: 'none' }}
                            />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444', fontSize: '14px' }}>Content</label>
                            <div style={{ marginBottom: '45px' }}>
                                <ReactQuill 
                                    theme="snow" 
                                    value={content} 
                                    onChange={setContent} 
                                    style={{ background: '#fff', borderRadius: '8px', height: '180px' }}
                                />
                            </div>
                        </div>

                        {/* Current Media Management */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#444', fontSize: '14px' }}>Current Media</label>
                            {post.medias && post.medias.length > 0 ? (
                                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                    {post.medias.map((media, index) => (
                                        <div key={index} style={{ position: 'relative', border: '1px solid #eaeaea', borderRadius: '8px', overflow: 'hidden', background: '#fafafa', width: '110px' }}>
                                            <img src={media.url} alt="media" style={{ width: '110px', height: '90px', objectFit: 'cover', display: 'block' }} />
                                            <button 
                                                type="button" 
                                                onClick={() => handleDeleteMedia(index)}
                                                style={{ background: '#dc3545', color: '#fff', border: 'none', width: '100%', padding: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: '#888', fontSize: '14px', margin: '0' }}>No media attached.</p>
                            )}
                        </div>

                        {/* Add New Media */}
                        <div style={{ marginBottom: '35px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444', fontSize: '14px' }}>Add New Media</label>
                            <div style={{ border: '2px dashed #ced4da', padding: '20px', borderRadius: '8px', textAlign: 'center', background: '#f8f9fa' }}>
                                <input 
                                    type="file" 
                                    multiple 
                                    onChange={(e) => setNewFiles(e.target.files)} 
                                    style={{ fontSize: '14px' }}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                type="submit" 
                                disabled={saving}
                                style={{ background: '#198754', color: '#fff', padding: '10px 24px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', boxShadow: '0 2px 4px rgba(25, 135, 84, 0.2)' }}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(false)}
                                style={{ background: '#6c757d', color: '#fff', padding: '10px 24px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}