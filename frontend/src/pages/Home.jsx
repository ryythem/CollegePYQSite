import Navbar from "../components/Navbar"
import SearchBox from "../components/SearchBox"

const Home = () => {
  return (
    <div className="min-h-screen bg-[#111] text-gray-200">
      <Navbar />

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-screen pt-16 pb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Find Your <span className="text-blue-500">Previous Year Questions</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl">
              Search through our database of previous year question papers to ace your exams
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <SearchBox />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

