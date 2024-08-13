import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import CreatePost from '../components/CreatePost';
import EditPost from '../components/EditPost';
import ActionLogs from '../pages/ActionLogs';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "create-post",
                element: <CreatePost />,
            },
            {
                path: "edit-post/:postId",
                element: <EditPost />,
            },
            {
                path: "actionlogs",
                element: <ActionLogs />,
            },
        ]
    }
]);

export default router;
