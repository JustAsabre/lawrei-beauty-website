export default function AboutSection() {
  return (
    <section id="about" className="py-16 px-6 bg-gradient-to-r from-rich-black to-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <img 
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000" 
              alt="Portrait of professional makeup artist Lawrei in her studio" 
              className="rounded-3xl shadow-2xl w-full h-auto" 
            />
          </div>
          <div className="animate-slide-up">
            <h2 className="font-display text-3xl font-bold mb-6 gradient-text">Meet Lawrei</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              With over 8 years of experience in the beauty industry, Lawrei has mastered the art of enhancing natural beauty while creating stunning transformations. Her passion for makeup artistry began in high school and has evolved into a thriving career serving clients for weddings, photoshoots, and special events.
            </p>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Specializing in both natural and glamorous looks, Lawrei believes that makeup should enhance your confidence and make you feel like the best version of yourself. Her attention to detail and personalized approach ensures every client leaves feeling beautiful and radiant.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-luxury-gold">500+</div>
                <div className="text-sm text-gray-400">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-luxury-gold">8</div>
                <div className="text-sm text-gray-400">Years Experience</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 bg-luxury-gold/20 text-luxury-gold rounded-full text-sm font-medium">Certified MUA</span>
              <span className="px-4 py-2 bg-luxury-gold/20 text-luxury-gold rounded-full text-sm font-medium">Bridal Specialist</span>
              <span className="px-4 py-2 bg-luxury-gold/20 text-luxury-gold rounded-full text-sm font-medium">Editorial Work</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
