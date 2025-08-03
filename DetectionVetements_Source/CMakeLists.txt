cmake_minimum_required(VERSION 3.16)
project(DetectionVetements)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Trouver OpenCV
find_package(OpenCV REQUIRED)

# Inclure les répertoires d'en-têtes
include_directories(${OpenCV_INCLUDE_DIRS})

# Créer l'exécutable
add_executable(detection_vetements main.cpp)

# Lier les bibliothèques OpenCV
target_link_libraries(detection_vetements ${OpenCV_LIBS})

# Copier les DLLs nécessaires après la compilation
if(WIN32)
    if(MSVC)
        # Visual Studio
        add_custom_command(TARGET detection_vetements POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E copy_if_different
            $<TARGET_FILE:opencv_core>
            $<TARGET_FILE:opencv_imgproc>
            $<TARGET_FILE:opencv_videoio>
            $<TARGET_FILE:opencv_highgui>
            $<TARGET_FILE:opencv_imgcodecs>
            $<TARGET_FILE:opencv_dnn>
            $<TARGET_FILE_DIR:detection_vetements>
        )
    else()
        # MinGW
        add_custom_command(TARGET detection_vetements POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E copy_if_different
            ${OpenCV_LIBS}
            $<TARGET_FILE_DIR:detection_vetements>
        )
    endif()
endif() 