#include <opencv2/opencv.hpp>
#include <opencv2/dnn.hpp>
#include <iostream>
#include <string>
#include <vector>
#include <chrono>
#include <thread>

using namespace cv;
using namespace cv::dnn;
using namespace std;

class DetectionVetements {
private:
    VideoCapture cap;
    Net net;
    vector<string> classes;
    bool running;
    
    // Couleurs pour l'affichage
    Scalar colorTshirt = Scalar(0, 255, 0);    // Vert pour t-shirt
    Scalar colorAutre = Scalar(0, 0, 255);     // Rouge pour autres vêtements
    Scalar colorTexte = Scalar(255, 255, 255); // Blanc pour le texte

public:
    DetectionVetements() : running(false) {
        // Initialiser les classes de vêtements
        classes = {"t-shirt", "pull", "chemise", "veste", "autre"};
        
        // Charger le modèle pré-entraîné (YOLO ou MobileNet)
        try {
            // Utiliser un modèle simple pour la détection de vêtements
            net = readNetFromCaffe("model/deploy.prototxt", "model/weights.caffemodel");
            cout << "Modèle chargé avec succès!" << endl;
        } catch (const cv::Exception& e) {
            cout << "Erreur lors du chargement du modèle: " << e.what() << endl;
            cout << "Utilisation du mode de détection basique..." << endl;
        }
    }

    bool initialiserWebcam() {
        cap.open(0); // Ouvrir la webcam par défaut
        if (!cap.isOpened()) {
            cout << "Erreur: Impossible d'ouvrir la webcam!" << endl;
            return false;
        }
        
        // Configurer la résolution
        cap.set(CAP_PROP_FRAME_WIDTH, 640);
        cap.set(CAP_PROP_FRAME_HEIGHT, 480);
        cap.set(CAP_PROP_FPS, 30);
        
        cout << "Webcam initialisée avec succès!" << endl;
        return true;
    }

    string detecterVetement(const Mat& frame) {
        // Algorithme de détection basique basé sur la couleur et la forme
        Mat hsv;
        cvtColor(frame, hsv, COLOR_BGR2HSV);
        
        // Détecter les zones de peau (pour identifier le haut du corps)
        Mat masquePeau;
        inRange(hsv, Scalar(0, 20, 70), Scalar(20, 255, 255), masquePeau);
        
        // Détecter les zones colorées (vêtements)
        Mat masqueVetements;
        inRange(hsv, Scalar(0, 50, 50), Scalar(180, 255, 255), masqueVetements);
        
        // Analyser la forme et la position
        vector<vector<Point>> contours;
        findContours(masqueVetements, contours, RETR_EXTERNAL, CHAIN_APPROX_SIMPLE);
        
        if (contours.empty()) {
            return "Aucun vêtement détecté";
        }
        
        // Analyser le plus grand contour (probablement le vêtement principal)
        double maxArea = 0;
        int maxIdx = -1;
        
        for (int i = 0; i < contours.size(); i++) {
            double area = contourArea(contours[i]);
            if (area > maxArea && area > 1000) { // Filtrer les petits contours
                maxArea = area;
                maxIdx = i;
            }
        }
        
        if (maxIdx == -1) {
            return "Aucun vêtement détecté";
        }
        
        // Analyser la forme du vêtement
        Rect boundingRect = cv::boundingRect(contours[maxIdx]);
        double ratio = (double)boundingRect.width / boundingRect.height;
        
        // Logique de classification basique
        if (ratio > 0.8 && ratio < 1.2) {
            return "T-shirt détecté";
        } else if (ratio > 1.2) {
            return "Pull/Chemise détecté";
        } else {
            return "Autre vêtement détecté";
        }
    }

    void afficherInterface(const Mat& frame, const string& resultat) {
        Mat affichage = frame.clone();
        
        // Ajouter un cadre autour de la zone de détection
        rectangle(affichage, Rect(50, 50, frame.cols - 100, frame.rows - 100), 
                 colorTexte, 2);
        
        // Afficher le résultat
        int fontFace = FONT_HERSHEY_SIMPLEX;
        double fontScale = 1.0;
        int thickness = 2;
        
        // Déterminer la couleur du texte selon le résultat
        Scalar couleurResultat = colorAutre;
        if (resultat.find("T-shirt") != string::npos) {
            couleurResultat = colorTshirt;
        }
        
        // Position du texte
        Point textPos(60, 40);
        
        // Ajouter un fond semi-transparent pour le texte
        rectangle(affichage, Rect(textPos.x - 10, textPos.y - 30, 
                                 resultat.length() * 20, 40), 
                 Scalar(0, 0, 0), -1);
        
        // Afficher le texte
        putText(affichage, resultat, textPos, fontFace, fontScale, 
                couleurResultat, thickness);
        
        // Ajouter des instructions
        string instructions = "Appuyez sur 'q' pour quitter, 's' pour sauvegarder";
        putText(affichage, instructions, Point(10, frame.rows - 20), 
                fontFace, 0.5, colorTexte, 1);
        
        imshow("Detection de Vetements", affichage);
    }

    void demarrer() {
        if (!initialiserWebcam()) {
            return;
        }
        
        running = true;
        cout << "\n=== Detection de Vetements ===" << endl;
        cout << "Instructions:" << endl;
        cout << "- Appuyez sur 'q' pour quitter" << endl;
        cout << "- Appuyez sur 's' pour sauvegarder une image" << endl;
        cout << "- Appuyez sur 'r' pour redémarrer la détection" << endl;
        cout << "==============================\n" << endl;
        
        Mat frame;
        int compteurImages = 0;
        
        while (running) {
            cap >> frame;
            
            if (frame.empty()) {
                cout << "Erreur: Impossible de capturer l'image de la webcam!" << endl;
                break;
            }
            
            // Détecter le vêtement
            string resultat = detecterVetement(frame);
            
            // Afficher l'interface
            afficherInterface(frame, resultat);
            
            // Gérer les touches
            char key = waitKey(1) & 0xFF;
            
            switch (key) {
                case 'q':
                case 'Q':
                    running = false;
                    cout << "Arrêt de l'application..." << endl;
                    break;
                    
                case 's':
                case 'S':
                    {
                        string nomFichier = "capture_" + to_string(compteurImages++) + ".jpg";
                        imwrite(nomFichier, frame);
                        cout << "Image sauvegardée: " << nomFichier << endl;
                    }
                    break;
                    
                case 'r':
                case 'R':
                    cout << "Redémarrage de la détection..." << endl;
                    break;
            }
            
            // Petite pause pour réduire l'utilisation CPU
            this_thread::sleep_for(chrono::milliseconds(30));
        }
        
        // Nettoyage
        cap.release();
        destroyAllWindows();
    }

    ~DetectionVetements() {
        if (cap.isOpened()) {
            cap.release();
        }
        destroyAllWindows();
    }
};

int main() {
    cout << "=== Programme de Detection de Vetements ===" << endl;
    cout << "Version: 1.0" << endl;
    cout << "Auteur: Assistant IA" << endl;
    cout << "==========================================\n" << endl;
    
    try {
        DetectionVetements detecteur;
        detecteur.demarrer();
    } catch (const exception& e) {
        cout << "Erreur fatale: " << e.what() << endl;
        cout << "Appuyez sur une touche pour quitter..." << endl;
        cin.get();
        return -1;
    }
    
    cout << "Programme termine avec succes!" << endl;
    return 0;
} 