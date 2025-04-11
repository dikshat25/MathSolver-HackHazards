export default function Footer({ isDarkMode }) {
    return (
      <footer className={`${isDarkMode ? 'bg-gray-950' : 'bg-purple-900'} text-white py-8`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="bg-white text-purple-900 p-1 rounded">
                  <span className="text-xl font-bold">∑</span>
                </div>
                <h1 className="ml-2 text-lg font-bold">MathGenie</h1>
              </div>
            </div>
            
            <div className="flex gap-6 mb-4 md:mb-0">
              <a href="#" className="hover:text-purple-300">About Us</a>
              <a href="#" className="hover:text-purple-300">Privacy</a>
              <a href="#" className="hover:text-purple-300">Terms</a>
              <a href="#" className="hover:text-purple-300">Contact</a>
            </div>
            
            <div>
              <p className="text-sm text-purple-300">© 2025 MathGenie. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }