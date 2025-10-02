import { useState, useEffect } from 'react';

function FullscreenButton() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement || !!document.webkitFullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

        // Auto-hide address bar on load
        window.scrollTo(0, 1);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                // Try multiple methods for Android Chrome
                const elem = document.documentElement;

                // Method 1: Standard Fullscreen API
                if (elem.requestFullscreen) {
                    await elem.requestFullscreen({ navigationUI: "hide" });
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                } else {
                    // Fallback: Hide UI elements manually
                    toggleUIHide();
                }
            } else {
                // Exit fullscreen
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else {
                    toggleUIHide();
                }
            }
        } catch (err) {
            console.error('Fullscreen error:', err);
            // Fallback to manual UI hiding
            toggleUIHide();
        }
    };

    const toggleUIHide = () => {
        setIsHidden(!isHidden);
        if (!isHidden) {
            // Hide address bar
            window.scrollTo(0, 1);
            // Add CSS class for pseudo-fullscreen
            document.body.classList.add('pseudo-fullscreen');
        } else {
            document.body.classList.remove('pseudo-fullscreen');
        }
    };

    return (
        <button
            onClick={toggleFullscreen}
            style={{
                position: 'fixed',
                top: '10px',
                right: '10px',
                zIndex: 9999,
                padding: '10px 20px',
                backgroundColor: isFullscreen || isHidden ? 'rgba(255, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
            }}
        >
            {(isFullscreen || isHidden) ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        </button>
    );
}

export default FullscreenButton;