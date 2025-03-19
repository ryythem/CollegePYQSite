import Navbar from "../components/Navbar"
import SearchBox from "../components/SearchBox"

const Home = () => {
  return (
    <div className="min-h-screen bg-[#111] text-gray-200">
      <Navbar />

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-screen pt-16 pb-20">
          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12 pt-16 md:pt-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">
              Find Your <span className="text-blue-500">Previous Year Questions</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg lg:text-xl px-4">
              Last Moment Studies? We got you covered! Search our database and ace your exams
            </p>
          </div>

          <div className="w-full max-w-2xl px-4 relative">
            <SearchBox />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

