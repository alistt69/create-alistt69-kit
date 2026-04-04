import { RouterProvider } from 'react-router-dom';
import { appRouter } from './providers/router/config/router';

function App() {
    return (
        <RouterProvider router={appRouter} />
    );
}

export default App;
