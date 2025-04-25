import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Academic Paper Reviewer
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Modern, AI-powered platform to review academic papers, receive actionable feedback,
          and discover relevant literature.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/auth/login"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get Started
          </Link>
          <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
            Learn more <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h3 className="text-lg font-semibold">AI-Powered Reviews</h3>
          <p className="mt-4 text-gray-600">
            Get instant feedback on your academic papers using advanced AI technology.
          </p>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h3 className="text-lg font-semibold">Smart Citations</h3>
          <p className="mt-4 text-gray-600">
            Discover relevant literature and improve your paper's references.
          </p>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h3 className="text-lg font-semibold">Export & Share</h3>
          <p className="mt-4 text-gray-600">
            Download, share, or save your feedback reports in various formats.
          </p>
        </div>
      </div>
    </div>
  )
} 