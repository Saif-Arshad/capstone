import { Link } from "react-router-dom"
import Layout from "../shared/Layout"
import logo from "/Screenshot_3.png";

function Dashboard() {
  return (
    <Layout>
      <div className="container mx-auto px-4 my-8">
        <div className="bg-gray-100 flex flex-col items-center justify-center p-6 rounded-lg shadow-md">
          <div>
            <Link to="/">
              <img src={logo} alt="logo" width={240} height={240} />
            </Link>
          </div>
          <h1 className="text-2xl mt-10 md:text-3xl font-bold mb-4">
            Welcome to Dashboard
          </h1>
          <div className="mt-4">
            <p className="text-gray-700">
              This is your personal dashboard area. Here you can view and manage your information.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
