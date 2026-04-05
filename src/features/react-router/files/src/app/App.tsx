import { RouterProvider } from 'react-router-dom';
import { appRouter } from './providers/router/config/router';
import styles from './styles.module.scss';

function App() {
    return (
        <div className={styles.app_wrapper}>
            <RouterProvider router={appRouter} />
        </div>
    );
}

export default App;
