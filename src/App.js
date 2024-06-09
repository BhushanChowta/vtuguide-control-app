import React from 'react';
import BloggerPosts from './components/BloggerPosts';
import CreatePost from './components/CreatePost';

const App = () => {
    return (
        <div className="App">
            <header className="App-header">
                <h1>My Blogger Posts</h1>
            </header>
            <main>
                <CreatePost />
                <BloggerPosts />
            </main>
        </div>
    );
};

export default App;
