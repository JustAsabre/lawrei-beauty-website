export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-luxury-gold to-soft-pink flex items-center justify-center">
              <span className="text-black font-bold text-sm">L</span>
            </div>
            <span className="font-display text-lg font-semibold gradient-text">Lawrei's Makeup</span>
          </div>
          
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2024 Lawrei's Makeup. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
