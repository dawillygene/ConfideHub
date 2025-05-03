import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import NewConfessionForm from '../components/NewConfessionForm';
import CategoriesSection from '../components/CategoriesSection';
import ConfessionFeed from '../components/ConfessionFeed';
import MentalHealthSupport from '../components/MentalHealthSupport';
import TestimonialsSection from '../components/TestimonialsSection';


const Home = () => {
    return (
        <>
            <HeroSection />
            <FeaturesSection />
            <NewConfessionForm />
            <CategoriesSection />
            <ConfessionFeed />
            <MentalHealthSupport />
            <TestimonialsSection />
        </>
    )
}

export default Home