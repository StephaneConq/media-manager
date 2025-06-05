import ChannelsCarousel from '../components/ChannelsCarousel';
import Searchbar from '../components/Searchbar';
import Videos from '../components/Videos';


function Home() {

    return (
        <>
            <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
                <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
                    <Searchbar />

                    <ChannelsCarousel />

                    <Videos />

                </div>
            </div>
        </>
    )
}

export default Home
