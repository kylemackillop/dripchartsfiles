
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Footer() {
  const footerLinks1 = [
    { title: "About", href: createPageUrl("About") },
    { title: "Contact", href: "mailto:info@dripcharts.com" },
    { title: "Help", href: createPageUrl("Help") },
    { title: "Careers", href: createPageUrl("Careers") },
    { title: "Suggestion Box", href: createPageUrl("SuggestionBox") },
  ];

  const footerLinks2 = [
    { title: "Acceptable Use Policy", href: createPageUrl("AcceptableUse") },
    { title: "Fair Trade Music Policy", href: createPageUrl("FairTradeMusic") },
    { title: "Copyright", href: createPageUrl("Copyright") },
    { title: "Privacy", href: createPageUrl("Privacy") },
    { title: "Terms of Use", href: createPageUrl("Terms") },
    { title: "Cookie Settings", href: createPageUrl("CookieSettings") },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold">DripCharts</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting passionate artists with the listeners who have been searching for their sound.
            </p>
          </div>
          <div className="md:col-span-1"></div>
          <div className="grid grid-cols-2 md:col-span-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks1.map((link) => (
                  <li key={link.title}>
                    {link.href.startsWith("mailto:") ? (
                      <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                        {link.title}
                      </a>
                    ) : (
                      <Link to={link.href} className="text-gray-400 hover:text-white transition-colors">
                        {link.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                {footerLinks2.map((link) => (
                  <li key={link.title}>
                    <Link to={link.href} className="text-gray-400 hover:text-white transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} DripCharts. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
