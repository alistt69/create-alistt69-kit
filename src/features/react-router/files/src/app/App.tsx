import { ReactNode } from 'react';
import CreatedBy from '@/widgets/created-by';
import styles from './styles.module.scss';

interface AppProps {
    router: ReactNode;
}

function App({ router }: AppProps) {
    return (
        <div className={styles.app_wrapper}>
            {router}
            <CreatedBy />
        </div>
    );
}

export default App;
