import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    FaLeaf, FaSearch, FaUpload, FaHistory,
    FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa';

// ----------------------------------------------------------------------
// 1. API INFERENCE FUNCTION (Using your backend server)
// ----------------------------------------------------------------------
const queryBackend = async (imageFile) => {
    try {
        // Convert image to Base64
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
        });
        reader.readAsDataURL(imageFile);
        const base64Image = await base64Promise;

        // Send image to backend (Express server)
        const response = await fetch("https://plant-ai-backend-ex2g.onrender.com/api/classify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageData: base64Image }),
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Server error: ${errText}`);
        }

        const data = await response.json();

        // Extract prediction from backend response (Roboflow)
        if (data.results) {
            // Note: If using an Object Detection model, this might need adjustment to iterate through 'predictions'
            const prediction = data.results.predictions?.[0]; 
            if (prediction) {
                return {
                    label: prediction.class || "Unknown",
                    score: prediction.confidence || 0.0,
                };
            }
        }

        throw new Error("No valid prediction found in server response.");

    } catch (error) {
        console.error("❌ Error contacting backend:", error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// 2. LABEL MAPPING + TREATMENT LOOKUP TABLE
// ----------------------------------------------------------------------

const labelMapping = (rawLabel) => {
    if (!rawLabel) return "Unknown";
    // 1. Clean up underscores/triple underscores
    let cleanLabel = rawLabel.replace(/___/g, ' - ').replace(/_/g, ' '); 
    
    // 2. Standardize 'Healthy' labels
    if (cleanLabel.toLowerCase().includes('healthy') || cleanLabel.toLowerCase().includes('plant'))
        return cleanLabel.replace(/healthy/i, 'Healthy Plant');
    
    // 3. --- NEW LOGIC: Change 'fruit' to 'vegetable' for Tomato labels ---
    if (cleanLabel.toLowerCase().includes('tomato')) {
        cleanLabel = cleanLabel.replace(/fruit/i, 'vegetable');
    }
    // --------------------------------------------------------------------

    return cleanLabel;
};

const defaultPrediction = { score: 0.0, label: "No Classification Run" };

// --- EXPANDED TREATMENT LOOKUP TABLE (Anthracnose key and advice added/corrected) ---
const TREATMENT_PLANS = {
    // --- HEALTHY STATUS ---
    'Healthy Plant': [
        "The plant appears **healthy**! Continue monitoring and ensure adequate water and light.",
        "Practice **preventative care** by ensuring good airflow and avoiding over-watering."
    ],

    // --- FALLBACK (Generic advice if a specific disease isn't mapped) ---
    'GENERIC_DISEASE': [
        "**Remove** all heavily infected leaves and debris immediately to limit spore spread.",
        "Isolate the plant, if possible, and apply a broad-spectrum **fungicide** or **bactericide** suitable for the plant species.",
        "Ensure proper airflow and avoid overhead watering."
    ],

    // --- APPLE TREATMENTS ---
    'Apple Scab Leaf': [
        "Apply **fungicide** (e.g., Captan, Mancozeb) starting at green tip and repeating every 7-10 days through the spring.",
        "Rake and destroy all fallen leaves in the autumn to reduce the primary source of infection."
    ],
    'Apple Rust Leaf': [
        "Apply specialized rust **fungicides** (e.g., myclobutanil) during the early spring when rust spores are active.",
        "If cedar trees are nearby (the alternate host), consider removing them or treating the cedar galls."
    ],
    'Apple Black Rot Leaf': [
        "Prune out and destroy infected branches and cankers during the dormant season.",
        "Follow a protective **fungicide** spray schedule throughout the growing season."
    ],

    // --- BELL PEPPER TREATMENTS ---
    'Bell pepper Leaf Spot': [
        "Use **copper-based fungicides** or bactericides. Treatment must be consistent and begin early.",
        "Avoid working with plants when they are wet, as this spreads bacteria/fungi."
    ],

    // --- CHERRY TREATMENTS ---
    'Cherry Powdery Mildew Leaf': [
        "Apply **sulfur** or a systemic fungicide. Begin treatment when mildew first appears.",
        "Ensure good air circulation and avoid excessive nitrogen fertilizer."
    ],

    // --- CORN TREATMENTS ---
    'Corn Gray Leaf Spot': [
        "Apply **fungicides** (e.g., strobilurins) if the disease is severe and detected early.",
        "Utilize **resistant corn hybrids** for future planting, as this is the best long-term control."
    ],
    'Corn Leaf Blight': [
        "Similar to Gray Leaf Spot, fungicide application is possible but **hybrid resistance** is preferred."
    ],
    'Corn Rust Leaf': [
        "Fungicide treatment is generally recommended only for high-value sweet corn or seed corn."
    ],

    // --- PEACH TREATMENTS ---
    'Peach Bacterial Spot Leaf': [
        "Control is difficult; use **copper sprays** during the dormant season and early leaf stages.",
        "Select **resistant cultivars** when possible."
    ],

    // --- POTATO TREATMENTS ---
    'Potato Early Blight Leaf': [
        "Apply protectant **fungicides** (e.g., chlorothalonil) before or at the first sign of disease.",
        "Ensure the plants receive adequate water and nutrients to stay vigorous."
    ],
    'Potato Late Blight Leaf': [
        "Requires immediate application of highly effective **fungicides** (e.g., metalaxyl or Mancozeb). This disease spreads quickly and is devastating.",
        "Destroy all potato and tomato plant debris after harvest."
    ],

    // --- SQUASH TREATMENTS ---
    'Squash Powdery Mildew Leaf': [
        "Use **Neem oil**, horticultural oils, or fungicides containing sulfur. Treat both upper and lower leaf surfaces.",
        "Increase spacing to improve light penetration and airflow."
    ],

    // --- STRAWBERRY TREATMENTS ---
    'Strawberry Leaf Scorch': [
        "Fungicides can be used, but **sanitation** is key: remove and destroy infected plant material.",
        "Ensure good drainage and maintain plant vigor."
    ],

    // --- TOMATO TREATMENTS ---
    'Tomato - Anthracnose fruit': [ // The key must remain the raw label output, even if we change the display text.
        "Apply **fungicides** containing chlorothalonil or maneb every 7-10 days, starting at flowering and continuing until harvest.",
        "Immediately **remove and destroy** all infected **vegetables/fruit** to prevent spread.",
        "Use **mulch** to prevent soil and fungal spores from splashing onto the tomato and lower leaves.",
        "Avoid overhead irrigation, especially in the evening, as moisture encourages fungal growth.",
        "Space plants adequately to **improve air circulation** and allow for quick drying."
    ],
    'Tomato Early Blight Leaf': [
        "Apply **chlorothalonil or copper fungicides** weekly from the time fruit sets.",
        "Mulch the soil and avoid overhead irrigation."
    ],
    'Tomato Late Blight Leaf': [
        "As with potatoes, requires aggressive, immediate application of specialized **fungicides**. **Quarantine** infected plants.",
    ],
    'Tomato Leaf Bacterial Spot': [
        "Use **copper-based sprays** plus mancozeb. Apply before or immediately after symptoms appear.",
        "Use disease-free seeds and transplants only."
    ],
    'Tomato Septoria Leaf Spot': [
        "Apply **fungicides** (e.g., chlorothalonil) starting when the first spots appear.",
        "Remove lower infected leaves as the disease often starts there."
    ],
    'Tomato Leaf Yellow Virus': [
        "There is **no chemical cure** for viral diseases. Remove and destroy infected plants immediately.",
        "Control **whiteflies** (the vector) using insecticidal soap or specific insecticides."
    ],
    'Tomato Leaf Mosaic Virus': [
        "There is **no cure**. Remove and destroy infected plants immediately.",
        "Disinfect hands and tools after handling infected plants, as the virus spreads easily by touch."
    ],
    'Tomato Two Spotted Spider Mites Leaf': [
        "Apply **miticides** (insecticides specific for mites) or **horticultural oil/Neem oil** to the undersides of the leaves.",
        "Mites thrive in dry, dusty conditions; regular misting can help."
    ],
};


// ----------------------------------------------------------------------
// 3. RESULT DISPLAY COMPONENT
// ----------------------------------------------------------------------
const PredictionDisplay = ({ prediction, loading, imagePreviewUrl }) => {

    const getTreatmentSuggestions = (disease) => {
        // NOTE: We use the raw, *cleaned* label (e.g., 'Tomato - Anthracnose fruit') 
        // to look up the treatment, as that is the key in TREATMENT_PLANS.
        let plans = TREATMENT_PLANS[disease]; 

        if (plans) {
            return plans; // Found a specific plan (including 'Healthy Plant')
        }

        // If not found, use the generic disease protocol
        return TREATMENT_PLANS['GENERIC_DISEASE'];
    };

    if (loading) {
        return (
            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                <FaLeaf className="w-8 h-8 mx-auto text-green-500 animate-spin" />
                <p className="mt-3 text-lg font-semibold text-green-700">
                    Analyzing leaf for diseases...
                </p>
            </div>
        );
    }

    if (!prediction || prediction.score === 0.0) {
        return (
            <div className="text-center p-6 bg-gray-100 rounded-xl border border-gray-300">
                <FaSearch className="w-8 h-8 mx-auto text-gray-500" />
                <p className="mt-3 text-lg font-semibold text-gray-700">
                    Upload or capture an image to begin.
                </p>
            </div>
        );
    }

    // This is where 'Tomato - Anthracnose fruit' becomes 'Tomato - Anthracnose vegetable'
    const predictedName = labelMapping(prediction.label); 
    
    // We must use the original key (before the fruit/vegetable replacement) to look up treatments.
    const treatmentKey = labelMapping(prediction.label).replace(/vegetable/i, 'fruit'); 
    
    const isHealthy = predictedName.toLowerCase().includes("healthy");
    const color = isHealthy ? "bg-green-500" : "bg-red-500";
    const icon = isHealthy ? <FaCheckCircle /> : <FaExclamationTriangle />;
    
    const treatmentSuggestions = getTreatmentSuggestions(treatmentKey);

    return (
        <div className={`p-6 rounded-xl shadow-lg transition duration-500 ${isHealthy ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} border-l-4`}>
            <div className="flex items-center space-x-4 mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl ${color}`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900"> Prediction Result</h3>
            </div>

            {imagePreviewUrl && (
                <div className="mb-4">
                    <img
                        src={imagePreviewUrl}
                        alt="Scanned Leaf"
                        className="max-h-40 w-full object-contain rounded-lg shadow-md"
                    />
                </div>
            )}

            <div className="space-y-4">
                {/* Disease Name */}
                <p className="text-lg font-bold text-gray-900">Disease Name</p>
                <p className={`text-2xl font-extrabold ${isHealthy ? 'text-green-800' : 'text-red-800'}`}>
                    {predictedName}
                </p>

                {/* Treatment Suggestions */}
                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="font-semibold text-gray-900 text-lg">Treatment Suggestions</p>
                    <ul className="list-disc list-inside text-sm text-gray-800 mt-2 space-y-1">
                        {treatmentSuggestions.map((sugg, idx) => (
                            <li key={idx} dangerouslySetInnerHTML={{ __html: sugg }} />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// 4. RECENT SCAN CARD
// ----------------------------------------------------------------------
const RecentScanCard = ({ name, date, imageUrl, altText, isDisease }) => (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border ${isDisease ? 'border-red-400' : 'border-green-400'}`}>
        <div className="h-36 w-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {imageUrl ? (
                <img src={imageUrl} alt={altText} className="object-cover w-full h-full" />
            ) : (
                <div className="text-gray-500 text-sm font-semibold">{name}</div>
            )}
        </div>
        <div className="p-4">
            <h3 className="text-base font-semibold text-gray-900 truncate">{name}</h3>
            <p className={`text-xs mt-1 font-medium ${isDisease ? 'text-red-600' : 'text-green-600'}`}>
                {isDisease ? 'ISSUE DETECTED' : 'HEALTHY'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Scanned on: {date}</p>
        </div>
    </div>
);

// ----------------------------------------------------------------------
// 5. MAIN COMPONENT (Part2)
// ----------------------------------------------------------------------
const Part2 = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prediction, setPrediction] = useState(defaultPrediction);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [scanHistory, setScanHistory] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileSelect = useCallback(async (event) => {
        const file = event.target.files[0];
        if (!file) {
            setError("Please select an image file.");
            return;
        }

        setLoading(true);
        setError(null);
        setPrediction(defaultPrediction);

        const url = URL.createObjectURL(file);
        setImagePreviewUrl(url);

        try {
            const result = await queryBackend(file);
            setLoading(false);

            if (result) {
                setPrediction(result);
                const predictedName = labelMapping(result.label);
                const isDisease = !predictedName.toLowerCase().includes("healthy");
                const newScan = {
                    id: Date.now().toString(),
                    name: predictedName,
                    date: new Date().toISOString().substring(0, 10),
                    imageUrl: url,
                    isDisease,
                };
                setScanHistory((prev) => [newScan, ...prev]);
            } else {
                setError("Classification returned empty result. Try a clearer image.");
            }
        } catch (err) {
            setLoading(false);
            setError(err.message || "Error during classification.");
        }

        event.target.value = null;
    }, []);

    useEffect(() => {
        return () => {
            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        };
    }, [imagePreviewUrl]);

    const handleUploadClick = () => fileInputRef.current?.click();

    return (
        <div className="bg-gray-50 min-h-screen pt-12 pb-24">
            <div className="flex justify-center items-center gap-3 mb-10 px-4">
                <div className="flex items-center w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-3">
                    <FaSearch className="text-gray-400 w-5 h-5 mr-3" />
                    <input
                        type="text"
                        placeholder="Search plants by name or disease..."
                        className="w-full outline-none text-gray-700 placeholder-gray-400"
                    />
                </div>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                <div className="p-8 border-2 border-dashed border-green-300 rounded-2xl shadow-xl bg-gradient-to-r from-green-100 to-yellow-100">
                    <div className="text-center">
                        <FaLeaf className="text-green-700 w-16 h-16 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Scan a Plant Leaf</h2>
                        <p className="text-sm text-gray-600 mb-6">Upload a clear image of the leaf to check for diseases.</p>

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                            disabled={loading}
                        />

                        <button
                            onClick={handleUploadClick}
                            className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            <FaUpload className="mr-2 inline" />
                            {loading ? 'Processing...' : 'Upload Image'}
                        </button>

                        {error && (
                            <p className="mt-4 text-red-600 text-sm font-medium flex items-center justify-center">
                                <FaExclamationTriangle className="mr-1" /> {error}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <PredictionDisplay prediction={prediction} loading={loading} imagePreviewUrl={imagePreviewUrl} />
                </div>
            </div>

            <hr className="my-16 border-t border-gray-200 max-w-7xl mx-auto" />

            <div className="bg-gray-50 py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-extrabold text-green-800 text-center mb-10 flex items-center justify-center">
                        <FaHistory className="mr-3 text-2xl" /> Recent Scan History
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {scanHistory.length > 0 ? (
                            scanHistory.map((scan) => (
                                <RecentScanCard key={scan.id} {...scan} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500 p-8 border border-gray-200 rounded-xl">
                                No scans available yet. Start by uploading an image!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Part2;