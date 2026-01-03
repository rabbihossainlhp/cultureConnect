 import { Link } from 'react-router'

function NotFound() {
  return (
    <div>
           <div>
           <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-orange-500 indigo-600">404</h1>
        <p className="text-2xl font-semibold text-gray-800 mt-4">Page Not Found</p>
        <p className="text-gray-600 mt-2">
          Sorry, the page you are looking for doesnt exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-orange-500 hover:bg-orange-700 text-white px-6 py-2 rounded-lg shadow"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
    </div>
    </div>
  )
}

export default NotFound