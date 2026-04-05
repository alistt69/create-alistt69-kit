import clsx from 'clsx';
import { NavLink, Outlet } from 'react-router-dom';
import styles from './styles.module.scss';

export default function AppLayout() {
    return (
        <div className={styles.layout_wrapper}>
            <aside className={styles.sidebar}>
                <nav>
                    <NavLink
                        className={({ isActive }) => clsx({
                            [styles.active]: isActive,
                        })}
                        to="/"
                    >
                        Main
                    </NavLink>
                </nav>
                <nav>
                    <NavLink
                        className={({ isActive }) => clsx({
                            [styles.active]: isActive,
                        })}
                        to="/error-route"
                    >
                        Error
                    </NavLink>
                </nav>
            </aside>

            <main>
                <Outlet />
            </main>
        </div>
    );
}
