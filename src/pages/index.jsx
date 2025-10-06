import Layout from "./Layout.jsx";

import Charts from "./Charts";

import Upload from "./Upload";

import Discover from "./Discover";

import Pricing from "./Pricing";

import TrackDetails from "./TrackDetails";

import ArtistProfile from "./ArtistProfile";

import SecuritySettings from "./SecuritySettings";

import AccountSettings from "./AccountSettings";

import About from "./About";

import Help from "./Help";

import Press from "./Press";

import Careers from "./Careers";

import AcceptableUse from "./AcceptableUse";

import FairTradeMusic from "./FairTradeMusic";

import Copyright from "./Copyright";

import Privacy from "./Privacy";

import Terms from "./Terms";

import CookieSettings from "./CookieSettings";

import BillingInfo from "./BillingInfo";

import CommunicationPreferences from "./CommunicationPreferences";

import SuggestionBox from "./SuggestionBox";

import AdminDashboard from "./AdminDashboard";

import ListenerInfo from "./ListenerInfo";

import ArtistPage from "./ArtistPage";

import PlaylistInfo from "./PlaylistInfo";

import EditPlaylist from "./EditPlaylist";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Charts: Charts,
    
    Upload: Upload,
    
    Discover: Discover,
    
    Pricing: Pricing,
    
    TrackDetails: TrackDetails,
    
    ArtistProfile: ArtistProfile,
    
    SecuritySettings: SecuritySettings,
    
    AccountSettings: AccountSettings,
    
    About: About,
    
    Help: Help,
    
    Press: Press,
    
    Careers: Careers,
    
    AcceptableUse: AcceptableUse,
    
    FairTradeMusic: FairTradeMusic,
    
    Copyright: Copyright,
    
    Privacy: Privacy,
    
    Terms: Terms,
    
    CookieSettings: CookieSettings,
    
    BillingInfo: BillingInfo,
    
    CommunicationPreferences: CommunicationPreferences,
    
    SuggestionBox: SuggestionBox,
    
    AdminDashboard: AdminDashboard,
    
    ListenerInfo: ListenerInfo,
    
    ArtistPage: ArtistPage,
    
    PlaylistInfo: PlaylistInfo,
    
    EditPlaylist: EditPlaylist,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Charts />} />
                
                
                <Route path="/Charts" element={<Charts />} />
                
                <Route path="/Upload" element={<Upload />} />
                
                <Route path="/Discover" element={<Discover />} />
                
                <Route path="/Pricing" element={<Pricing />} />
                
                <Route path="/TrackDetails" element={<TrackDetails />} />
                
                <Route path="/ArtistProfile" element={<ArtistProfile />} />
                
                <Route path="/SecuritySettings" element={<SecuritySettings />} />
                
                <Route path="/AccountSettings" element={<AccountSettings />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/Help" element={<Help />} />
                
                <Route path="/Press" element={<Press />} />
                
                <Route path="/Careers" element={<Careers />} />
                
                <Route path="/AcceptableUse" element={<AcceptableUse />} />
                
                <Route path="/FairTradeMusic" element={<FairTradeMusic />} />
                
                <Route path="/Copyright" element={<Copyright />} />
                
                <Route path="/Privacy" element={<Privacy />} />
                
                <Route path="/Terms" element={<Terms />} />
                
                <Route path="/CookieSettings" element={<CookieSettings />} />
                
                <Route path="/BillingInfo" element={<BillingInfo />} />
                
                <Route path="/CommunicationPreferences" element={<CommunicationPreferences />} />
                
                <Route path="/SuggestionBox" element={<SuggestionBox />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/ListenerInfo" element={<ListenerInfo />} />
                
                <Route path="/ArtistPage" element={<ArtistPage />} />
                
                <Route path="/PlaylistInfo" element={<PlaylistInfo />} />
                
                <Route path="/EditPlaylist" element={<EditPlaylist />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}