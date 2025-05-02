const Footer = () => {
  return (
    <>
      <footer class="bg-gray-800 text-white py-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-xl font-bold mb-4">Confide<span class="text-tertiary">Hub</span></h3>
                    <p class="text-gray-400 mb-4">A safe space for anonymous confessions and community support.</p>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-400 hover:text-white transition">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-white transition">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-white transition">
                            <i class="fab fa-facebook"></i>
                        </a>
                    </div>
                </div>

                <div>
                    <h4 class="font-bold mb-4">Quick Links</h4>
                    <ul class="space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Home</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Browse Confessions</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Categories</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Mental Health Resources</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">About Us</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-bold mb-4">Support</h4>
                    <ul class="space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Help Center</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Community Guidelines</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Report an Issue</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-bold mb-4">Subscribe to Our Newsletter</h4>
                    <p class="text-gray-400 mb-4">Get weekly mental health tips and community updates.</p>
                    <div class="flex">
                        <input type="email" placeholder="Your email" class="px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-primary text-gray-800" />
                        <button class="bg-primary hover:bg-opacity-90 px-4 py-2 rounded-r-lg transition">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p class="text-gray-400 text-sm">© 2023 ConfideHub. All rights reserved.</p>
                <div class="flex space-x-4 mt-4 md:mt-0">
                    <a href="#" class="text-gray-400 hover:text-white text-sm transition">Privacy Policy</a>
                    <a href="#" class="text-gray-400 hover:text-white text-sm transition">Terms of Service</a>
                    <a href="#" class="text-gray-400 hover:text-white text-sm transition">Cookie Policy</a>
                </div>
            </div>
        </div>
    </footer>


    <div class="fixed bottom-6 right-6">
        <button class="w-12 h-12 bg-white text-primary rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition">
            <i class="fas fa-moon text-xl"></i>
        </button>
    </div>

 
    <div class="fixed bottom-6 left-6">
        <button class="w-12 h-12 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-opacity-90 transition">
            <i class="fas fa-comment-dots text-xl"></i>
        </button>
    </div>

    </>
  );
};

export default Footer;