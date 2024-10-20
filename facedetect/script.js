// Function to initialize video and face detection
async function startVideo() {
    const video = document.getElementById('videoElement');
    const overlay = document.getElementById('overlay');
    const canvasContext = overlay.getContext('2d');

    // Access the webcam stream
    navigator.mediaDevices.getUserMedia({ video: { width: 720, height: 560 } })
        .then((stream) => {
            video.srcObject = stream;
            video.play();
        })
        .catch((error) => {
            console.error('Error accessing webcam:', error);
            alert('Error accessing webcam. Please check your webcam settings.');
        });

    video.addEventListener('play', async () => {
        console.log('Video is playing...');

        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(overlay, displaySize);
        console.log('Canvas dimensions:', overlay.width, overlay.height);

        setInterval(async () => {
            // Detect faces using OpenCV face detection model
            const frame = new cv.Mat(video, cv.CV_8UC4);
            const gray = new cv.Mat();
            cv.cvtColor(frame, gray, cv.COLOR_RGBA2GRAY);
            const faces = faceCascade.detectMultiScale(gray);
            const detections = faces.map((face) => {
                return new faceapi.Rect(face.x, face.y, face.width, face.height);
            });

            // Clear previous drawings
            canvasContext.clearRect(0, 0, overlay.width, overlay.height);

            // Draw new detection boxes
            detections.forEach((detection) => {
                canvasContext.font = '16px Arial';
                canvasContext.fillStyle = 'white';
                canvasContext.textAlign = 'center';
                canvasContext.textBaseline = 'top';
                canvasContext.fillText('Face', detection.x + detection.width / 2, detection.y + detection.height + 10);
            });
        }, 100);
    });

    video.addEventListener('error', (error) => {
        console.error('Error playing video:', error);
        alert('Error playing video. Please check your webcam settings.');
    });
}

// Button event to start video
document.getElementById('startButton').addEventListener('click', () => {
    startVideo();
});