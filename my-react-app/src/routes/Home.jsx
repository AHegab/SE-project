    import React from 'react';
    import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
    import './styleHomePage.css';
    function HomePage() {
    return (
        <div className="home-page">
        <header>
            <h1>Welcome to our Car Website</h1>
            <nav>
            <ul>
                <li><Link to="/cars">View All Cars</Link></li>
                <li><Link to="/about">About Us</Link></li>
                {/* Add more navigation links as needed */}
            </ul>
            </nav>
        </header>
        <main>
            <section className="featured-cars">
            <h2>Featured Cars</h2>
            {/* Display featured cars here */}
            <div className="car-list">
                {/* Example car card */}
                <div className="car-card">
                <img src="https://cdn.vox-cdn.com/thumbor/IZ7fpJNSeEO1v2vNapVlLYlCWzc=/214x0:1037x549/1200x800/filters:focal(214x0:1037x549)/cdn.vox-cdn.com/uploads/chorus_image/image/45200072/new-ford-gt-supercar-0006.0.0.jpg" alt="Car" />
                <h3>Car Model</h3>
                <p>Description of the car...</p>
                <Link to="/cars/car-id">View Details</Link>
                </div>
                {/* Add more car cards for other featured cars */}
            </div>
            </section>
            <section className="latest-news">
            <h2>Latest News</h2>
            {/* Display latest news articles here */}
            <div className="news-list">
                {/* Example news article */}
                <div className="news-article">
                <h3>News Title</h3>
                <p>Summary of the news...</p>
                <Link to="/news/news-id">Read More</Link>
                </div>
                {/* Add more news articles */}
            </div>
            </section>
        </main>
        <footer>
            <p>&copy; 2024 Car Website. All rights reserved.</p>
        </footer>
        </div>
    );
    }

export default HomePage;
