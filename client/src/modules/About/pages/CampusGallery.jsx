import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Maximize2, MoveUpRight } from 'lucide-react';

const CampusGallery = () => {
    // Only using user-provided images as requested
    const userImageNames = [
        "IMG_0810_optimized.jpg", "IMG_0811_optimized.jpg", "IMG_0812_optimized.jpg", "IMG_0813_optimized.jpg", "IMG_0814_optimized.jpg",
        "IMG_0815_optimized.jpg", "IMG_0816_optimized.jpg", "IMG_0817_optimized.jpg", "IMG_0818_optimized.jpg", "IMG_0819_optimized.jpg",
        "IMG_0820_optimized.jpg", "IMG_0821_optimized.jpg", "IMG_0822_optimized.jpg", "IMG_0824_optimized.jpg", "IMG_0825_optimized.jpg",
        "IMG_0826_optimized.jpg", "IMG_0827_optimized.jpg", "IMG_0828_optimized.jpg", "IMG_0829_optimized.jpg", "IMG_0830_optimized.jpg",
        "IMG_0831_optimized.jpg", "IMG_0832_optimized.jpg"
    ];

    const images = userImageNames.map((name, index) => ({
        id: `user-${index}`,
        src: `/assets/images/campus-gallery/${name}`,
        title: `Perspective ${String(index + 1).padStart(2, '0')}`,
        location: 'Main Campus',
        height: index % 4 === 0 ? 'aspect-[4/5]' : (index % 3 === 0 ? 'aspect-[1/1]' : 'aspect-[3/4]')
    }));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] pt-40 pb-32 px-6 sm:px-12 lg:px-20 font-sans selection:bg-black selection:text-white">
            {/* Minimalist Background Decoration */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
                <div className="absolute top-[10%] right-[5%] text-[20vw] font-black tracking-tighter leading-none select-none">MGM</div>
                <div className="absolute bottom-[5%] left-[5%] text-[15vw] font-black tracking-tighter leading-none select-none italic">EST 1984</div>
            </div>

            <div className="max-w-[1600px] mx-auto relative z-10">
                {/* Header: Minimalist Architectural Style */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                    <div className="max-w-2xl">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <div className="w-12 h-[1px] bg-black/20" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-black/40">Exhibition 01</span>
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-7xl md:text-8xl font-light tracking-tighter text-slate-950 leading-[0.9]"
                        >
                            Campus <br />
                            <span className="font-serif italic text-blue-600">Chronicles</span>
                        </motion.h1>
                    </div>
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-right hidden md:block"
                    >
                        <p className="text-[13px] font-medium text-slate-400 uppercase tracking-widest mb-2">Location</p>
                        <p className="text-lg font-bold text-slate-900 uppercase tracking-tighter italic">Nanded, Maharashtra</p>
                    </motion.div>
                </div>

                {/* Gallery Grid: Refined Staggered Columns */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-12 space-y-12"
                >
                    {images.map((image, idx) => (
                        <motion.div 
                            key={image.id}
                            variants={itemVariants}
                            className="relative group break-inside-avoid"
                        >
                            {/* Image Frame */}
                            <div className={`relative ${image.height} overflow-hidden bg-slate-100 ring-1 ring-black/5 rounded-sm transition-all duration-700 group-hover:ring-black/10 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)]`}>
                                <img 
                                    src={image.src} 
                                    alt={image.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                    loading="lazy"
                                />
                                
                                {/* Refined Overlay */}
                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500" />
                                
                                {/* Top-Right Interaction Icon */}
                                <div className="absolute top-6 right-6 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                    <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center text-black">
                                        <MoveUpRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Minimalist Caption Below Image */}
                            <div className="mt-6 flex justify-between items-start">
                                <div>
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 mb-1">
                                        {String(idx + 1).padStart(3, '0')} — Perspective
                                    </h3>
                                    <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {image.location}
                                    </p>
                                </div>
                                <span className="text-[10px] font-medium text-slate-300 italic">2026</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footer: Fine Print */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-40 pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6"
                >
                    <div className="flex gap-8 items-center">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20">Archive</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20">Portfolio</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20">Journal</span>
                    </div>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                        © 2026 MGM College of Engineering. All Rights Reserved.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default CampusGallery;
