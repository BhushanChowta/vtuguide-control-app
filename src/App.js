import React, { useState } from 'react';
import BloggerPosts from './components/BloggerPosts';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';

const App = () => {
    const [editingPost, setEditingPost] = useState(null);

    return (
        <div className="App">
            <header className="App-header">
                <h1>My Blogger Posts</h1>
            </header>
            <main>
                <CreatePost />
                {editingPost && (
                    <EditPost 
                        postId={editingPost.id} 
                        existingTitle={editingPost.title} 
                        existingContent={editingPost.content} 
                        onClose={() => setEditingPost(null)}
                    />
                )}
                <BloggerPosts onEdit={setEditingPost} />
            </main>
        </div>
    );
};

export default App;
