import { ReactNode } from 'react';
import Logo from '../../public/create-alistt69-kit-logo.svg';
import styles from './styles.module.scss';

interface AppProps {
    router: ReactNode;
}

function App({ router }: AppProps) {
    return (
        <div className={styles.app_wrapper}>
            <div className={styles.created_by_section}>
                <Logo className={styles.logo} />
                <p className={styles.promo}>
                    created by create-alistt69-kit
                </p>
            </div>
            {router}
        </div>
    );
}

export default App;
