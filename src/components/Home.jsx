import React from 'react';
import Card from './Card';

const Home = () => {
    const features = [
        {
            title: "Compress Image",
            description: "Reduce image file size while maintaining quality. Perfect for optimizing web images.",
            path: "/compress-image"
        },
        {
            title: "Resize Image",
            description: "Change image dimensions to fit your needs. Supports various aspect ratios.",
            path: "/resize-image"
        },
        {
            title: "Crop Image",
            description: "Crop images to focus on specific areas. Supports custom crop sizes.",
            path: "/crop-image"
        },
        {
            title: "Convert to JPG",
            description: "Convert images from various formats to JPG. Maintains image quality.",
            path: "/convert-to-jpg"
        },
        {
            title: "Convert from JPG",
            description: "Convert JPG images to other formats like PNG, WEBP, etc.",
            path: "/convert-from-jpg"
        },
        {
            title: "Photo Editor",
            description: "Edit and enhance your photos with various filters and adjustments.",
            path: "/photo-editor"
        },
        {
            title: "Watermark Image",
            description: "Add text or image watermarks to protect your images.",
            path: "/watermark-image"
        },
        {
            title: "Blur Face",
            description: "Automatically detect and blur faces in images for privacy protection.",
            path: "/blur-face"
        },
        {
            title: "Remove Background",
            description: "Remove image backgrounds automatically with high accuracy.",
            path: "/remove-background"
        },
        {
            title: "Upscale Image",
            description: "Increase image resolution without losing quality using AI technology.",
            path: "/upscale-image"
        },
        {
            title: "Rotate Image",
            description: "Rotate images to any angle for proper orientation.",
            path: "/rotate-image"
        },
        // {
        //     title: "Add Filters",
        //     description: "Apply various artistic filters to enhance your images.",
        //     path: "/add-filters"
        // }
    ];

    return (
        <div className="container mx-auto p-6 pt-24">
            {/* Hero Section */}
            <div className="text-center mb-20">
                <h1 className="text-4xl font-bold text-white mb-6">Welcome to I❤IMG</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
                    Your all-in-one image processing solution. Optimize, convert, and edit images with ease.
                </p>

                {/* Why Choose Us Section */}
                <div className="bg-gray-800/50 rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-8">Why Choose I❤IMG?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-gray-800/30 rounded-lg">
                            <h3 className="text-xl font-semibold text-white mb-3">Fast Processing</h3>
                            <p className="text-gray-400">
                                Our advanced algorithms ensure quick image processing without compromising quality.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-800/30 rounded-lg">
                            <h3 className="text-xl font-semibold text-white mb-3">Easy to Use</h3>
                            <p className="text-gray-400">
                                Simple and intuitive interface makes image editing accessible to everyone.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-800/30 rounded-lg">
                            <h3 className="text-xl font-semibold text-white mb-3">Secure & Private</h3>
                            <p className="text-gray-400">
                                Your images are processed securely and never stored on our servers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            title={feature.title}
                            description={feature.description}
                            path={feature.path}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home; 