
import Sidebar from "./sidebar";

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="md:ml-64 p-6 w-full mt-16 md:mt-0">
                {children}
            </main>
        </div>
    );
};

export default Layout;