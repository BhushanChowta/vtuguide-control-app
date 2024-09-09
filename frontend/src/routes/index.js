import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import CreatePost from '../components/CreatePost';
import EditPost from '../components/EditPost';
import PublicBlogSubmission from '../components/PublicBlogSubmission';
import ActionLogs from '../pages/ActionLogs';
import PostShow from '../pages/PostShow';
import Dashboard from '../pages/Dashboard';
import PostSubmissions from '../pages/PostSubmissions';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/dashboard",
                element: <Dashboard  />,
            },
            {
                path: "create-post",
                element: <CreatePost />,
            },
            {
                path: "post/:postId",
                element: <PostShow />,
            },
            {
                path: "edit-post/:postId",
                element: <EditPost />,
            },
            {
                path: "actionlogs",
                element: <ActionLogs />,
            },
            {
                path: "postSubmissions",
                element: <PostSubmissions />,
            },
        ]
    },
    {
        path: "contribute/:blogId",
        element: <PublicBlogSubmission />,
    },
]);

export default router;
