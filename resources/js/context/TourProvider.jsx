import React, { createContext, useContext, useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTranslation } from 'react-i18next';

// Create Context
const TourContext = createContext();

// Tour Provider Component
export const TourProvider = ({ children }) => {
    const { i18n, t } = useTranslation();

    const [tourCompleted, setTourCompleted] = useState(
        localStorage.getItem('tourCompleted') === 'true'
    );

    const [currentStep, setCurrentStep] = useState(
        parseInt(localStorage.getItem('lastStepIndex')) || 0
    );

    const [isLoggedIn, setIsLoggedIn] = useState(false); // Add state to track login status
    const [userRole, setUserRole] = useState(null);

    // const router = useRoute()

    // Define tour steps for different roles
    const tourStepsByRole = {
        'Central Adminstrator': [
            {
                element: '#welcome',
                popover: {
                    title: t('welcome'),
                    description: t('welcomeTourDesc'),
                    side: 'left',
                    align: 'start',
                },
            },
            {
                element: '#countries',
                popover: {
                    title: t('step', { step: 1 }),
                    description:
                        t('countriesTourDesc', { name: t('countries') }) +
                        t('pressNext'),
                    side: 'left',
                    align: 'start',
                },
            },
            {
                element: '#add_New_countries',
                popover: {
                    title: t('step', { step: 2 }),
                    description: t('addNewButtonTour') + t('pressNext'),
                    side: 'right',
                    align: 'start',
                },
            },
            {
                element: '#createCountry',
                popover: {
                    title: t('step', { step: 3 }),
                    description:
                        t('countryInfo', { name: t('Country') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#addProvice',
                popover: {
                    title: t('step', { step: 4 }),
                    description:
                        t('provinceAdd', { button: t('provinces') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#createProvince',
                popover: {
                    title: t('step', { step: 5 }),
                    description:
                        t('countryInfo', { name: t('provinces') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#saveCountries',
                popover: {
                    title: t('step', { step: 6 }),
                    description:
                        t('provinceAdd', { button: t('save') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#schools',
                popover: {
                    title: t('step', { step: 7 }),
                    description:
                        t('countriesTourDesc', { name: t('schools') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#addSchools',
                popover: {
                    title: t('step', { step: 8 }),
                    description: t('addNewButtonTour') + t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#createSchools',
                popover: {
                    title: t('step', { step: 9 }),
                    description:
                        t('countryInfo', { name: t('school') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#saveSchools',
                popover: {
                    title: t('step', { step: 10 }),
                    description:
                        t('provinceAdd', { button: t('save') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#libraries',
                popover: {
                    title: t('step', { step: 11 }),
                    description:
                        t('countriesTourDesc', { name: t('libraries') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#addLibraries',
                popover: {
                    title: t('step', { step: 12 }),
                    description: t('addNewButtonTour') + t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#createLibraries',
                popover: {
                    title: t('step', { step: 13 }),
                    description:
                        t('countryInfo', { name: t('library') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#detailsLibraries',
                popover: {
                    title: t('step', { step: 14 }),
                    description:
                        t('provinceAdd', { button: t('library_details') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#detailsLibrariesCreate',
                popover: {
                    title: t('step', { step: 15 }),
                    description:
                        t('countryInfo', { name: t('library_details') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#saveLibraries',
                popover: {
                    title: t('step', { step: 16 }),
                    description:
                        t('provinceAdd', { button: t('save') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#students',
                popover: {
                    title: t('step', { step: 17 }),
                    description:
                        t('countriesTourDesc', { name: t('students') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#addStudents',
                popover: {
                    title: t('step', { step: 18 }),
                    description: t('addNewButtonTour') + t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#createStudents',
                popover: {
                    title: t('step', { step: 19 }),
                    description:
                        t('countryInfo', { name: t('student_information') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#saveStudents',
                popover: {
                    title: t('step', { step: 20 }),
                    description:
                        t('provinceAdd', { button: t('save') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#parents',
                popover: {
                    title: t('step', { step: 21 }),
                    description:
                        t('countriesTourDesc', { name: t('parents') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#addParents',
                popover: {
                    title: t('step', { step: 22 }),
                    description: t('addNewButtonTour') + t('pressNext'),

                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#createParents',
                popover: {
                    title: t('step', { step: 23 }),
                    description:
                        t('countryInfo', { name: t('parent_information') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#addStudentsToParent',
                popover: {
                    title: t('step', { step: 24 }),
                    description:
                        t('provinceAdd', { button: t('students') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#addStudentsParent',
                popover: {
                    title: t('step', { step: 25 }),
                    description:
                        t('countryInfo', { name: t('students') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#saveParents',
                popover: {
                    title: t('step', { step: 26 }),
                    description:
                        t('provinceAdd', { button: t('save') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#dashboard',
                popover: {
                    title: 'Final Step',
                    description: 'Enjoy.',
                    side: 'bottom',
                    align: 'start',
                },
            },
        ],
        'Country Representative': [
            {
                element: '#welcome',
                popover: {
                    title: t('welcome'),
                    description: t('welcomeTourDesc'),
                    side: 'left',
                    align: 'start',
                },
            },
            {
                element: '#schools',
                popover: {
                    title: t('step', { step: 1 }),
                    description:
                        t('countriesTourDesc', { name: t('schools') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#addSchools',
                popover: {
                    title: t('step', { step: 2 }),
                    description: t('addNewButtonTour') + t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#createSchools',
                popover: {
                    title: t('step', { step: 3 }),
                    description:
                        t('countryInfo', { name: t('school') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#saveSchools',
                popover: {
                    title: t('step', { step: 4 }),
                    description:
                        t('provinceAdd', { button: t('save') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#libraries',
                popover: {
                    title: t('step', { step: 5 }),
                    description:
                        t('countriesTourDesc', { name: t('libraries') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#addLibraries',
                popover: {
                    title: t('step', { step: 6 }),
                    description: t('addNewButtonTour') + t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#createLibraries',
                popover: {
                    title: t('step', { step: 7 }),
                    description:
                        t('countryInfo', { name: t('library') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#detailsLibraries',
                popover: {
                    title: t('step', { step: 8 }),
                    description:
                        t('provinceAdd', { button: t('library_details') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#detailsLibrariesCreate',
                popover: {
                    title: t('step', { step: 9 }),
                    description:
                        t('countryInfo', { name: t('library_details') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#saveLibraries',
                popover: {
                    title: t('step', { step: 10 }),
                    description:
                        t('provinceAdd', { button: t('save') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#students',
                popover: {
                    title: t('step', { step: 11 }),
                    description:
                        t('countriesTourDesc', { name: t('students') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#addStudents',
                popover: {
                    title: t('step', { step: 12 }),
                    description: t('addNewButtonTour') + t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#createStudents',
                popover: {
                    title: t('step', { step: 13 }),
                    description:
                        t('countryInfo', { name: t('student_information') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#saveStudents',
                popover: {
                    title: t('step', { step: 14 }),
                    description:
                        t('provinceAdd', { button: t('save') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#parents',
                popover: {
                    title: t('step', { step: 15 }),
                    description:
                        t('countriesTourDesc', { name: t('parents') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#addParents',
                popover: {
                    title: t('step', { step: 16 }),
                    description: t('addNewButtonTour') + t('pressNext'),

                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#createParents',
                popover: {
                    title: t('step', { step: 17 }),
                    description:
                        t('countryInfo', { name: t('parent_information') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#addStudentsToParent',
                popover: {
                    title: t('step', { step: 18 }),
                    description:
                        t('provinceAdd', { button: t('students') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#addStudentsParent',
                popover: {
                    title: t('step', { step: 19 }),
                    description:
                        t('countryInfo', { name: t('students') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#saveParents',
                popover: {
                    title: t('step', { step: 20 }),
                    description:
                        t('provinceAdd', { button: t('save') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#dashboard',
                popover: {
                    title: 'Final Step',
                    description: 'Enjoy.',
                    side: 'bottom',
                    align: 'start',
                },
            },
        ],
        // Add other roles and their steps here
        Librarian: [
            {
                element: '#welcome',
                popover: {
                    title: t('welcome'),
                    description: t('welcomeTourDesc'),
                    side: 'left',
                    align: 'start',
                },
            },
            {
                element: '#categories',
                popover: {
                    title: t('step', { step: 1 }),
                    description:
                        t('countriesTourDesc', { name: t('categories') }) +
                        t('pressNext'),
                    side: 'left',
                    align: 'start',
                },
            },
            {
                element: '#add_New_categories',
                popover: {
                    title: t('step', { step: 2 }),
                    description: t('addNewButtonTour') + t('pressNext'),
                    side: 'right',
                    align: 'start',
                },
            },
            {
                element: '#createCategories',
                popover: {
                    title: t('step', { step: 3 }),
                    description:
                        t('countryInfo', { name: t('Category') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#saveCategories',
                popover: {
                    title: t('step', { step: 4 }),
                    description:
                        t('provinceAdd', { button: t('save') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            // authors
            {
                element: '#authors',
                popover: {
                    title: t('step', { step: 5 }),
                    description:
                        t('countriesTourDesc', { name: t('authors') }) +
                        t('pressNext'),
                    side: 'left',
                    align: 'start',
                },
            },
            {
                element: '#add_New_Authors',
                popover: {
                    title: t('step', { step: 6 }),
                    description: t('addNewButtonTour') + t('pressNext'),
                    side: 'right',
                    align: 'start',
                },
            },
            {
                element: '#createAuthors',
                popover: {
                    title: t('step', { step: 7 }),
                    description:
                        t('countryInfo', { name: t('Author') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#saveAuthors',
                popover: {
                    title: t('step', { step: 8 }),
                    description:
                        t('provinceAdd', { button: t('save') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#books',
                popover: {
                    title: t('step', { step: 9 }),
                    description:
                        t('countriesTourDesc', { name: t('books') }) +
                        t('pressNext'),
                    side: 'left',
                    align: 'start',
                },
            },
            {
                element: '#add_New_books',
                popover: {
                    title: t('step', { step: 10 }),
                    description: t('addNewButtonTour') + t('pressNext'),
                    side: 'right',
                    align: 'start',
                },
            },
            {
                element: '#createBooks',
                popover: {
                    title: t('step', { step: 11 }),
                    description:
                        t('countryInfo', { name: t('Book') }) + t('pressNext'),
                    side: 'right',
                    align: 'start',
                },
            },
            {
                element: '#addInventory',
                popover: {
                    title: t('step', { step: 12 }),
                    description:
                        t('provinceAdd', { button: t('inventoies') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#createInv',
                popover: {
                    title: t('step', { step: 13 }),
                    description:
                        t('countryInfo', { name: t('inventoies') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#saveBooks',
                popover: {
                    title: t('step', { step: 14 }),
                    description:
                        t('provinceAdd', { button: t('save') }) +
                        t('pressNext'),
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#dashboard',
                popover: {
                    title: 'Final Step',
                    description: 'Enjoy.',
                    side: 'bottom',
                    align: 'start',
                },
            },
        ],
    };

    const driverObj = driver({
        doneBtnText: t('finish'),
        // allowClose: false,
        nextBtnText: t('next'),
        prevBtnText: t('previous'),

        steps:
            tourStepsByRole[userRole] || [],

        onNextClick: (el, stepIndex) => {
            const last = driverObj.isLastStep();

            if (last) {
                localStorage.setItem('tourCompleted', 'true');
                setTourCompleted(true);
                driverObj.destroy();
            }
            driverObj.moveNext();
            localStorage.setItem('lastStepIndex', driverObj.getActiveIndex());
        },
        onPrevClick: (el, stepIndex) => {
            if (!driverObj.isFirstStep()) {
                driverObj.movePrevious();
            }
            localStorage.setItem('lastStepIndex', driverObj.getActiveIndex());
        },
        onCloseClick: (el, stepIndex, options) => {
            if (!driverObj.hasNextStep() || confirm('Are you sure?')) {
                driverObj.destroy();
                localStorage.setItem(
                    'lastStepIndex',
                    options.state.activeIndex
                );
                localStorage.setItem('tourCompleted', 'true');
            }
        },
        onDestroyStarted: () => {
            if (!driverObj.hasNextStep() || confirm('Are you sure?')) {
                driverObj.destroy();
                localStorage.setItem('tourCompleted', 'true');
            }
        },
    });

    // Start the tour
    const startTour = () => {
        if (isLoggedIn && !tourCompleted && userRole) {
            // Check if user is logged in and userRole is set
            setTimeout(() => {
                driverObj.drive(currentStep); // Start the tour from the last step index
            }, 500);
        }
    };

    // Reset the tour
    const resetTour = () => {
        localStorage.removeItem('tourCompleted');
        localStorage.removeItem('lastStepIndex');
        setTourCompleted(false);
        setCurrentStep(0);
        startTour();
    };

    useEffect(() => {
        startTour();
    }, [tourCompleted, currentStep, isLoggedIn, userRole]); // Add userRole to dependencies

    return (
        <TourContext.Provider
            value={{
                startTour,
                resetTour,
                tourCompleted,
                setIsLoggedIn,
                setUserRole,
            }}
        >
            {children}
        </TourContext.Provider>
    );
};

// Custom Hook to use the Tour
export const useTour = () => {
    return useContext(TourContext);
};
