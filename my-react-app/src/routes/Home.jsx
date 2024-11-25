    import React ,{ useState, useEffect } from 'react';
    // import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
    import './styleHomePage.css';
    import axios from 'axios';
    
    function HomePage() {

            const [featuredCars, setFeaturedCars] = useState([]);
            const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        async function fetchFeaturedCars() {
        try {
            const response = await axios.get('http://localhost:3001/v1/api/Product');
            setFeaturedCars(response.data);
        } catch (error) {
            console.error('Error fetching featured cars:', error);
        }
        }

        fetchFeaturedCars();
    }, []);

    useEffect(() => {
        
        const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex === featuredCars.length - 1 ? 0 : prevIndex + 1));
        }, 7000);
        console.log(featuredCars);
        // Clean up the interval on component unmount
        return () => clearInterval(interval);
    }, [featuredCars]);


    return (
        <div className="home-page">
        
        <main>
        <section className="featured-cars">
            <h2>Featured Cars</h2>
            <div className="carousel">
                {featuredCars.length > 0 && (
                <div className="frame">
                    <img src={featuredCars[currentImageIndex].imageLink} alt={`Car ${currentImageIndex}`} />
                </div>
                )}
            </div>
        </section>
        </main>
        </div>
    );
    }


export default HomePage;
