import Logo from '../../public/alistt69-packages-logo.svg';
import styles from './styles.module.scss';

function App() {
    return (
        <div className={styles.app_wrapper}>
            <div className={styles.created_by_section}>
                <Logo className={styles.logo} />
                <p className={styles.promo}>
                    created by create-alistt69-kit
                </p>
            </div>
        </div>
    );
}

export default App;
