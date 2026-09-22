"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type LanguageCode = "en" | "es" | "fr" | "ta" | "de" | "ar";

export interface Language {
  code: LanguageCode;
  label: string;
  nativeName: string;
  dir: "ltr" | "rtl";
}

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", nativeName: "English", dir: "ltr" },
  { code: "es", label: "Español", nativeName: "Español", dir: "ltr" },
  { code: "fr", label: "Français", nativeName: "Français", dir: "ltr" },
  { code: "ta", label: "Tamil", nativeName: "தமிழ்", dir: "ltr" },
  { code: "de", label: "Deutsch", nativeName: "Deutsch", dir: "ltr" },
  { code: "ar", label: "Arabic", nativeName: "العربية", dir: "rtl" },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.admissions": "Admissions",
    "nav.adminPortal": "Admin Portal",
    "nav.parentPortal": "Parent Portal",
    "nav.enrollNow": "Enroll Now",
    "nav.selectLanguage": "Select Language",

    // Hero Section
    "hero.badge": "Complete School ERP Platform",
    "hero.title1": "Smarter School",
    "hero.title2": "ERP Platform.",
    "hero.title3": "Seamless Operations.",
    "hero.title4": "Better Learning.",
    "hero.subtitle": "An all-in-one School ERP solution designed to automate admissions, fee collections, attendance, examinations, and payroll — connecting administrators, teachers, parents, and students in real time.",
    "hero.trustedBy": "Trusted by 1,000+ schools",
    "hero.countries": "across 20+ countries",

    // Hero Floating Cards
    "card.attendance": "Student Attendance",
    "card.present": "Present",
    "card.absent": "Absent",
    "card.total": "Total",
    "card.performance": "Academic Performance",
    "card.timetable": "Classes & Timetable",
    "card.exams": "Exams & Results",
    "card.fees": "Fees & Payments",
    "card.reports": "Reports & Analytics",
    "card.activeStudents": "Active Students",

    // Stats Section
    "stats.badge": "Why GGPS School",
    "stats.title1": "Built for",
    "stats.title2": "Smarter Education",
    "stats.subtitle": "Powerful tools and intelligent automation to make school management simpler, faster and more efficient — for everyone.",
    "stats.m1_badge": "Reliable",
    "stats.m1_title": "Attendance Accuracy",
    "stats.m1_desc": "Real-time biometric & mobile logs",
    "stats.m2_badge": "Automated",
    "stats.m2_title": "Paperless Fee Collection",
    "stats.m2_desc": "Automated receipts & reminders",
    "stats.m3_badge": "Instant",
    "stats.m3_title": "Report Cards & Timetables",
    "stats.m3_desc": "Instant generation & export",
    "stats.m4_badge": "Always On",
    "stats.m4_title": "Parent Portal Access",
    "stats.m4_desc": "Mobile diary & live updates",

    // Features Section
    "features.eyebrow": "ONE PLATFORM. COMPLETE SCHOOL MANAGEMENT.",
    "features.title1": "Designed for Modern",
    "features.title2": "Academic Excellence",
    "features.subtitle": "Everything your school needs to operate smoothly, engage parents, empower educators, and guide student achievement.",
    "features.smartAuto": "SMART AUTOMATION",
    "features.intelOps": "Intelligent Operations",
    "features.intelOpsDesc": "Automate class scheduling, admissions workflows, transport management, and staff payroll with zero paperwork.",
    "features.betterInsights": "BETTER INSIGHTS",
    "features.perfRubrics": "Performance & Rubrics",
    "features.perfRubricsDesc": "Track cognitive, motor, and academic milestones with comprehensive teacher grading, rubrics, and automated report cards.",
    "features.safeConnected": "SAFE & CONNECTED",
    "features.secureConnected": "Secure & Connected",
    "features.secureConnectedDesc": "Role-based access control for Admins, Teachers, and Parents with instant announcements, WhatsApp updates, and real-time alerts.",
    "features.exploreMore": "Explore More",

    // CTA Banner
    "cta.eyebrow": "BUILT FOR THE FUTURE OF EDUCATION",
    "cta.title1": "Transform your",
    "cta.title2": "school today",
    "cta.subtitle": "Join hundreds of forward-thinking institutions using E.A.S. Academy to elevate their educational standard.",
    "cta.apply": "Apply for Admission",
    "cta.signIn": "Admin Sign In",

    // Footer
    "footer.desc": "Intelligent all-in-one school management platform unifying admissions, academics, fee operations, and parent communication.",
    "footer.admissionsOpen": "Admissions open for 2026–2027",
    "footer.explore": "EXPLORE",
    "footer.management": "MANAGEMENT",
    "footer.contactSupport": "CONTACT & SUPPORT",
    "footer.campusAddress": "E.A.S. Academy Campus, Main Avenue",
    "footer.applyOnline": "Apply Online",
    "footer.rights": "© 2026 E.A.S. Academy School. All rights reserved.",
    "footer.verified": "Verified School Portal",
    "footer.staffPortal": "Staff Portal",

    // Login Page
    "login.welcomeBack": "WELCOME BACK",
    "login.signInTitle": "Sign In to Your Account",
    "login.signInSubtitle": "Access your GGPS School portal and manage your academic journey.",
    "login.email": "Email Address",
    "login.password": "Password",
    "login.forgotPassword": "Forgot password?",
    "login.rememberMe": "Remember me",
    "login.secureLogin": "Secure Login",
    "login.signInBtn": "Sign In",
    "login.signingIn": "Signing in...",
    "login.or": "OR",
    "login.google": "Continue with Google",
    "login.microsoft": "Continue with Microsoft",
    "login.noAccount": "Don't have an account?",
    "login.applyAdmission": "Apply for Admission",
    "login.backHome": "← Back to Home",
    "login.heroTitle": "Excellence in",
    "login.heroTitleHighlight": "Education.",
    "login.heroSubtitle": "Join over 1,000+ top educational institutions streamlining administration, academics, and parent trust.",

    // Admissions Page
    "adm.eyebrow": "STUDENT ENROLLMENT",
    "adm.title": "Student",
    "adm.titleHighlight": "Enrollment",
    "adm.subtitle": "Complete the details below to register a new student with GGPS School.",
    "adm.step1": "Student Information",
    "adm.step2": "Parent / Guardian",
    "adm.step3": "Review & Submit",
    "adm.firstName": "FIRST NAME",
    "adm.lastName": "LAST NAME",
    "adm.dob": "DATE OF BIRTH",
    "adm.gender": "GENDER",
    "adm.grade": "GRADE LEVEL APPLYING FOR",
    "adm.parentName": "PARENT / GUARDIAN NAME",
    "adm.contactNumber": "CONTACT PHONE NUMBER",
    "adm.address": "RESIDENTIAL ADDRESS",
    "adm.next": "Next Step",
    "adm.back": "Back",
    "adm.submit": "Submit Application",
    "adm.cancel": "Clear & Cancel",
  },

  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.admissions": "Admisiones",
    "nav.adminPortal": "Portal de Admin",
    "nav.parentPortal": "Portal de Padres",
    "nav.enrollNow": "Inscríbete Ahora",
    "nav.selectLanguage": "Seleccionar Idioma",

    // Hero Section
    "hero.badge": "Plataforma Integral de ERP Escolar",
    "hero.title1": "Escuela Más Inteligente",
    "hero.title2": "Plataforma ERP.",
    "hero.title3": "Operaciones Fluidas.",
    "hero.title4": "Mejor Aprendizaje.",
    "hero.subtitle": "Solución integral de ERP escolar para automatizar admisiones, recaudación de cuotas, asistencia, exámenes y nóminas, conectando a toda la comunidad educativa en tiempo real.",
    "hero.trustedBy": "Confiado por más de 1,000 escuelas",
    "hero.countries": "en más de 20 países",

    // Hero Floating Cards
    "card.attendance": "Asistencia Estudiantil",
    "card.present": "Presente",
    "card.absent": "Ausente",
    "card.total": "Total",
    "card.performance": "Rendimiento Académico",
    "card.timetable": "Clases y Horarios",
    "card.exams": "Exámenes y Resultados",
    "card.fees": "Cuotas y Pagos",
    "card.reports": "Informes y Análisis",
    "card.activeStudents": "Estudiantes Activos",

    // Stats Section
    "stats.badge": "Por qué GGPS School",
    "stats.title1": "Diseñado para",
    "stats.title2": "una Educación Más Inteligente",
    "stats.subtitle": "Herramientas potentes y automatización inteligente para que la gestión escolar sea más simple, rápida y eficiente para todos.",
    "stats.m1_badge": "Confiable",
    "stats.m1_title": "Precisión de Asistencia",
    "stats.m1_desc": "Registros biométricos y móviles en tiempo real",
    "stats.m2_badge": "Automatizado",
    "stats.m2_title": "Cobro de Tarifas sin Papel",
    "stats.m2_desc": "Recibos y recordatorios automatizados",
    "stats.m3_badge": "Instantáneo",
    "stats.m3_title": "Boletas y Horarios",
    "stats.m3_desc": "Generación y exportación en 1 clic",
    "stats.m4_badge": "Siempre Activo",
    "stats.m4_title": "Portal de Padres 24/7",
    "stats.m4_desc": "Diario móvil y actualizaciones en vivo",

    // Features Section
    "features.eyebrow": "UNA PLATAFORMA. GESTIÓN ESCOLAR COMPLETA.",
    "features.title1": "Diseñado para la",
    "features.title2": "Excelencia Académica",
    "features.subtitle": "Todo lo que su escuela necesita para operar fluidamente, involucrar a los padres y potenciar a los educadores.",
    "features.smartAuto": "AUTOMATIZACIÓN INTELIGENTE",
    "features.intelOps": "Operaciones Inteligentes",
    "features.intelOpsDesc": "Automatice horarios de clase, admisiones, transporte y nómina del personal con cero papeleo.",
    "features.betterInsights": "MEJORES PERSPECTIVAS",
    "features.perfRubrics": "Rendimiento y Rúbricas",
    "features.perfRubricsDesc": "Monitoree logros cognitivos, motores y académicos con calificaciones docentes, rúbricas y libretas automatizadas.",
    "features.safeConnected": "SEGURO Y CONECTADO",
    "features.secureConnected": "Seguro y Conectado",
    "features.secureConnectedDesc": "Control de acceso basado en roles para directores, profesores y familias con avisos instantáneos.",
    "features.exploreMore": "Explorar Más",

    // CTA Banner
    "cta.eyebrow": "CREADO PARA EL FUTURO DE LA EDUCACIÓN",
    "cta.title1": "Transforma tu",
    "cta.title2": "escuela hoy",
    "cta.subtitle": "Únase a cientos de instituciones visionarias que utilizan E.A.S. Academy para elevar sus estándares educativos.",
    "cta.apply": "Solicitar Admisión",
    "cta.signIn": "Iniciar Sesión de Admin",

    // Footer
    "footer.desc": "Plataforma inteligente e integral de gestión escolar que unifica admisiones, academia, finanzas y comunicación familiar.",
    "footer.admissionsOpen": "Admisiones abiertas 2026–2027",
    "footer.explore": "EXPLORAR",
    "footer.management": "GESTIÓN",
    "footer.contactSupport": "CONTACTO Y SOPORTE",
    "footer.campusAddress": "Campus GGPS , Avenida Principal",
    "footer.applyOnline": "Postular en Línea",
    "footer.rights": "© 2026 GGPS School. Todos los derechos reservados.",
    "footer.verified": "Portal Escolar Verificado",
    "footer.staffPortal": "Portal del Personal",

    // Login Page
    "login.welcomeBack": "BIENVENIDO DE NUEVO",
    "login.signInTitle": "Inicia Sesión en tu Cuenta",
    "login.signInSubtitle": "Accede al portal escolar de E.A.S. Academy y gestiona tu trayectoria académica.",
    "login.email": "Correo Electrónico",
    "login.password": "Contraseña",
    "login.forgotPassword": "¿Olvidaste tu contraseña?",
    "login.rememberMe": "Recordarme",
    "login.secureLogin": "Inicio Seguro",
    "login.signInBtn": "Iniciar Sesión",
    "login.signingIn": "Iniciando sesión...",
    "login.or": "O",
    "login.google": "Continuar con Google",
    "login.microsoft": "Continuar con Microsoft",
    "login.noAccount": "¿No tienes una cuenta?",
    "login.applyAdmission": "Solicitar Admisión",
    "login.backHome": "← Volver al Inicio",
    "login.heroTitle": "Excelencia en la",
    "login.heroTitleHighlight": "Educación.",
    "login.heroSubtitle": "Únase a más de 1,000 instituciones educativas de primer nivel que optimizan su administración.",

    // Admissions Page
    "adm.eyebrow": "INSCRIPCIÓN DE ESTUDIANTES",
    "adm.title": "Inscripción de",
    "adm.titleHighlight": "Estudiantes",
    "adm.subtitle": "Complete los datos a continuación para registrar a un nuevo estudiante en GGPS School.",
    "adm.step1": "Datos del Estudiante",
    "adm.step2": "Padre / Tutor",
    "adm.step3": "Revisar y Enviar",
    "adm.firstName": "NOMBRE",
    "adm.lastName": "APELLIDO",
    "adm.dob": "FECHA DE NACIMIENTO",
    "adm.gender": "GÉNERO",
    "adm.grade": "GRADO AL QUE POSTULA",
    "adm.parentName": "NOMBRE DEL PADRE / TUTOR",
    "adm.contactNumber": "TELÉFONO DE CONTACTO",
    "adm.address": "DIRECCIÓN DE RESIDENCIA",
    "adm.next": "Siguiente Paso",
    "adm.back": "Atrás",
    "adm.submit": "Enviar Solicitud",
    "adm.cancel": "Limpiar y Cancelar",
  },

  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.admissions": "Admissions",
    "nav.adminPortal": "Portail Admin",
    "nav.parentPortal": "Portail Parents",
    "nav.enrollNow": "S'inscrire Maintenant",
    "nav.selectLanguage": "Choisir la Langue",

    // Hero Section
    "hero.badge": "Plateforme ERP Scolaire Complète",
    "hero.title1": "École Plus Intelligente",
    "hero.title2": "Plateforme ERP.",
    "hero.title3": "Opérations Fluides.",
    "hero.title4": "Meilleur Apprentissage.",
    "hero.subtitle": "Une solution ERP scolaire tout-en-un conçue pour automatiser les admissions, les frais de scolarité, les présences, les examens et la paie en temps réel.",
    "hero.trustedBy": "Approuvé par plus de 1 000 écoles",
    "hero.countries": "dans plus de 20 pays",

    // Hero Floating Cards
    "card.attendance": "Présence des Élèves",
    "card.present": "Présent",
    "card.absent": "Absent",
    "card.total": "Total",
    "card.performance": "Performance Académique",
    "card.timetable": "Cours & Emploi du Temps",
    "card.exams": "Examens & Résultats",
    "card.fees": "Frais & Paiements",
    "card.reports": "Rapports & Analyses",
    "card.activeStudents": "Élèves Actifs",

    // Stats Section
    "stats.badge": "Pourquoi GGPS School",
    "stats.title1": "Conçu pour",
    "stats.title2": "une Éducation Plus Intelligente",
    "stats.subtitle": "Des outils puissants et une automatisation intelligente pour rendre la gestion scolaire plus simple et plus efficace pour tous.",
    "stats.m1_badge": "Fiable",
    "stats.m1_title": "Précision des Présences",
    "stats.m1_desc": "Journaux biométriques et mobiles en direct",
    "stats.m2_badge": "Automatisé",
    "stats.m2_title": "Paiement des Frais Sans Papier",
    "stats.m2_desc": "Reçus et rappels automatisés",
    "stats.m3_badge": "Instantané",
    "stats.m3_title": "Bulletins & Emplois du Temps",
    "stats.m3_desc": "Génération et export en 1 clic",
    "stats.m4_badge": "Disponible 24/7",
    "stats.m4_title": "Accès Portail Parents",
    "stats.m4_desc": "Cahier de textes mobile et actualités en direct",

    // Features Section
    "features.eyebrow": "UNE PLATEFORME. GESTION SCOLAIRE COMPLÈTE.",
    "features.title1": "Conçu pour l'Excellence",
    "features.title2": "Académique Moderne",
    "features.subtitle": "Tout ce dont votre école a besoin pour fonctionner de manière transparente et guider la réussite des élèves.",
    "features.smartAuto": "AUTOMATISATION INTELLIGENTE",
    "features.intelOps": "Opérations Intelligentes",
    "features.intelOpsDesc": "Automatisez les plannings, les admissions, les transports scolaires et la paie sans paperasse.",
    "features.betterInsights": "MEILLEURES ANALYSES",
    "features.perfRubrics": "Performance & Évaluations",
    "features.perfRubricsDesc": "Suivez les étapes cognitives, motrices et académiques avec des grilles d'évaluation automatisées.",
    "features.safeConnected": "SÉCURISÉ & CONNECTÉ",
    "features.secureConnected": "Sécurisé & Connecté",
    "features.secureConnectedDesc": "Contrôle d'accès par rôle pour administrateurs, enseignants et parents avec alertes en temps réel.",
    "features.exploreMore": "En Savoir Plus",

    // CTA Banner
    "cta.eyebrow": "CONÇU POUR L'AVENIR DE L'ÉDUCATION",
    "cta.title1": "Transformez votre",
    "cta.title2": "école dès aujourd'hui",
    "cta.subtitle": "Rejoignez des centaines d'établissements avant-gardistes qui utilisent E.A.S. Academy pour élever leurs standards.",
    "cta.apply": "Demander l'Admission",
    "cta.signIn": "Connexion Admin",

    // Footer
    "footer.desc": "Plateforme intelligente tout-en-un unifiant les admissions, la scolarité, la facturation et la communication avec les parents.",
    "footer.admissionsOpen": "Inscriptions ouvertes pour 2026–2027",
    "footer.explore": "EXPLORER",
    "footer.management": "GESTION",
    "footer.contactSupport": "CONTACT & SUPPORT",
    "footer.campusAddress": "Campus E.A.S. Academy, Avenue Principale",
    "footer.applyOnline": "Postuler en Ligne",
    "footer.rights": "© 2026 École E.A.S. Academy. Tous droits réservés.",
    "footer.verified": "Portail Scolaire Vérifié",
    "footer.staffPortal": "Portail Personnel",

    // Login Page
    "login.welcomeBack": "BIENVENUE",
    "login.signInTitle": "Connectez-vous à Votre Compte",
    "login.signInSubtitle": "Accédez au portail de l'école E.A.S. Academy et gérez votre parcours académique.",
    "login.email": "Adresse E-mail",
    "login.password": "Mot de Passe",
    "login.forgotPassword": "Mot de passe oublié ?",
    "login.rememberMe": "Se souvenir de moi",
    "login.secureLogin": "Connexion Sécurisée",
    "login.signInBtn": "Se Connecter",
    "login.signingIn": "Connexion...",
    "login.or": "OU",
    "login.google": "Continuer avec Google",
    "login.microsoft": "Continuer avec Microsoft",
    "login.noAccount": "Vous n'avez pas de compte ?",
    "login.applyAdmission": "Demander l'Admission",
    "login.backHome": "← Retour à l'Accueil",
    "login.heroTitle": "Excellence dans",
    "login.heroTitleHighlight": "l'Éducation.",
    "login.heroSubtitle": "Rejoignez plus de 1 000 établissements scolaires d'élite qui simplifient leur gestion.",

    // Admissions Page
    "adm.eyebrow": "INSCRIPTION SCOLAIRE",
    "adm.title": "Inscription de",
    "adm.titleHighlight": "l'Élève",
    "adm.subtitle": "Remplissez les informations ci-dessous pour inscrire un nouvel élève à GGPS School.",
    "adm.step1": "Informations de l'Élève",
    "adm.step2": "Parent / Tuteur",
    "adm.step3": "Vérifier & Soumettre",
    "adm.firstName": "PRÉNOM",
    "adm.lastName": "NOM",
    "adm.dob": "DATE DE NAISSANCE",
    "adm.gender": "GENRE",
    "adm.grade": "CLASSE SOUHAITÉE",
    "adm.parentName": "NOM DU PARENT / TUTEUR",
    "adm.contactNumber": "NUMÉRO DE TÉLÉPHONE",
    "adm.address": "ADRESSE DU DOMICILE",
    "adm.next": "Étape Suivante",
    "adm.back": "Retour",
    "adm.submit": "Soumettre le Dossier",
    "adm.cancel": "Effacer & Annuler",
  },

  ta: {
    // Navigation
    "nav.home": "முகப்பு",
    "nav.admissions": "சேர்க்கைகள்",
    "nav.adminPortal": "நிர்வாக போர்டல்",
    "nav.parentPortal": "பெற்றோர் போர்டல்",
    "nav.enrollNow": "இப்போது சேருங்கள்",
    "nav.selectLanguage": "மொழியைத் தேர்வு செய்க",

    // Hero Section
    "hero.badge": "முழுமையான பள்ளி ERP தளம்",
    "hero.title1": "ஸ்மார்ட் பள்ளி",
    "hero.title2": "ஈஆர்பி தளம்.",
    "hero.title3": "தடையற்ற செயல்பாடுகள்.",
    "hero.title4": "சிறந்த கற்றல்.",
    "hero.subtitle": "மாணவர் சேர்க்கை, கட்டணம் வசூலித்தல், வருகைப்பதிவு, தேர்வுகள் மற்றும் ஊதியப் பட்டியலை தானியக்கமாக்க வடிவமைக்கப்பட்ட முழுமையான பள்ளி மேலாண்மை தளம்.",
    "hero.trustedBy": "1,000+ பள்ளிகளால் நம்பப்படுகிறது",
    "hero.countries": "20+ நாடுகளில் பரவியுள்ளது",

    // Hero Floating Cards
    "card.attendance": "மாணவர் வருகை",
    "card.present": "வருகை",
    "card.absent": "வரவில்லை",
    "card.total": "மொத்தம்",
    "card.performance": "கல்விச் செயல்திறன்",
    "card.timetable": "வகுப்புகள் & கால அட்டவணை",
    "card.exams": "தேர்வுகள் & முடிவுகள்",
    "card.fees": "கட்டணங்கள் & ரசீதுகள்",
    "card.reports": "அறிக்கைகள் & பகுப்பாய்வு",
    "card.activeStudents": "பயிலும் மாணவர்கள்",

    // Stats Section
    "stats.badge": "ஏன் GGPS பள்ளி?",
    "stats.title1": "உருவாக்கப்பட்டது",
    "stats.title2": "சிறந்த கல்விக்காக",
    "stats.subtitle": "பள்ளி நிர்வாகத்தை எளிமையாகவும், வேகமாகவும், திறமையாகவும் மாற்ற உதவும் சக்திவாய்ந்த கருவிகள்.",
    "stats.m1_badge": "நம்பகமானது",
    "stats.m1_title": "வருகைப்பதிவு துல்லியம்",
    "stats.m1_desc": "கைரேகை மற்றும் மொபைல் நேரலை பதிவுகள்",
    "stats.m2_badge": "தானியங்கி",
    "stats.m2_title": "காகிதமில்லா கட்டண வசூல்",
    "stats.m2_desc": "தானியங்கி ரசீதுகள் மற்றும் நினைவூட்டல்கள்",
    "stats.m3_badge": "உடனடி",
    "stats.m3_title": "மதிப்பெண் & கால அட்டவணை",
    "stats.m3_desc": "1-கிளிக்கில் உடனடியாக உருவாக்குதல்",
    "stats.m4_badge": "24 மணி நேரமும்",
    "stats.m4_title": "பெற்றோர் போர்டல் அணுகல்",
    "stats.m4_desc": "மொபைல் டைரி மற்றும் நேரலை தகவல்கள்",

    // Features Section
    "features.eyebrow": "ஒரே தளம். முழுமையான பள்ளி மேலாண்மை.",
    "features.title1": "வடிவமைக்கப்பட்டது",
    "features.title2": "நவீன கல்விச் சிறப்புக்கு",
    "features.subtitle": "பள்ளி சீராக இயங்கவும், பெற்றோரை இணைக்கவும், ஆசிரியர்களை மேம்படுத்தவும் தேவையான அனைத்தும்.",
    "features.smartAuto": "ஸ்மார்ட் தானியக்கம்",
    "features.intelOps": "அறிவார்ந்த செயல்பாடுகள்",
    "features.intelOpsDesc": "வகுப்பு அட்டவணைகள், சேர்க்கை வழிகள், போக்குவரத்து மற்றும் ஊதியப் பட்டியலை காகிதமின்றி நிர்வகியுங்கள்.",
    "features.betterInsights": "சிறந்த நுண்ணறிவு",
    "features.perfRubrics": "செயல்திறன் & மதிப்பீடு",
    "features.perfRubricsDesc": "மாணவர்களின் அறிவாற்றல் மற்றும் கல்வி மைல்கற்களை விரிவான ஆசிரியர் மதிப்பீட்டுடன் கண்காணிக்கவும்.",
    "features.safeConnected": "பாதுகாப்பானது & இணைக்கப்பட்டது",
    "features.secureConnected": "பாதுகாப்பான இணைப்பு",
    "features.secureConnectedDesc": "நிர்வாகிகள், ஆசிரியர்கள் மற்றும் பெற்றோருக்கான உடனடி அறிவிப்புகள் மற்றும் பாதுகாப்பு வசதிகள்.",
    "features.exploreMore": "மேலும் அறிய",

    // CTA Banner
    "cta.eyebrow": "கல்வியின் எதிர்காலத்திற்காக உருவாக்கப்பட்டது",
    "cta.title1": "உங்கள் பள்ளியை",
    "cta.title2": "இன்றே மாற்றுங்கள்",
    "cta.subtitle": "தங்கள் கல்வித் தரத்தை உயர்த்த   பயன்படுத்தும் நூற்றுக்கணக்கான பள்ளிகளுடன் இணையுங்கள்.",
    "cta.apply": "சேர்க்கைக்கு விண்ணப்பிக்கவும்",
    "cta.signIn": "நிர்வாகி உள்நுழைவு",

    // Footer
    "footer.desc": "சேர்க்கை, கல்வி, கட்டணம் மற்றும் பெற்றோர் தகவல்தொடர்புகளை ஒருங்கிணைக்கும் அறிவார்ந்த பள்ளி மேலாண்மை தளம்.",
    "footer.admissionsOpen": "2026–2027 சேர்க்கை நடைபெறுகிறது",
    "footer.explore": "ஆராயுங்கள்",
    "footer.management": "மேலாண்மை",
    "footer.contactSupport": "தொடர்பு & ஆதரவு",
    "footer.campusAddress": "GGPS பள்ளி வளாகம், முதன்மை சாலை",
    "footer.applyOnline": "ஆன்லைனில் விண்ணப்பிக்க",
    "footer.rights": "© 2026 GGPS School. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    "footer.verified": "சரிபார்க்கப்பட்ட பள்ளி போர்டல்",
    "footer.staffPortal": "பணியாளர் போர்டல்",

    // Login Page
    "login.welcomeBack": "மீண்டும் வருக",
    "login.signInTitle": "உங்கள் கணக்கில் உள்நுழைக",
    "login.signInSubtitle": "E.A.S. அகாடமி போர்ட்டலை அணுகி கல்வி விவரங்களை நிர்வகிக்கவும்.",
    "login.email": "மின்னஞ்சல் முகவரி",
    "login.password": "கடவுச்சொல்",
    "login.forgotPassword": "கடவுச்சொல் மறந்துவிட்டதா?",
    "login.rememberMe": "நினைவில் வைக்கவும்",
    "login.secureLogin": "பாதுகாப்பான உள்நுழைவு",
    "login.signInBtn": "உள்நுழைக",
    "login.signingIn": "உள்நுழைகிறது...",
    "login.or": "அல்லது",
    "login.google": "Google உடன் தொடரவும்",
    "login.microsoft": "Microsoft உடன் தொடரவும்",
    "login.noAccount": "கணக்கு இல்லையா?",
    "login.applyAdmission": "சேர்க்கைக்கு விண்ணப்பிக்கவும்",
    "login.backHome": "← முகப்புக்குத் திரும்பு",
    "login.heroTitle": "கல்வியில்",
    "login.heroTitleHighlight": "சிறந்து விளங்குதல்.",
    "login.heroSubtitle": "1,000+ சிறந்த கல்வி நிறுவனங்களுடன் இணைந்து பள்ளி நிர்வாகத்தை எளிமைப்படுத்துங்கள்.",

    // Admissions Page
    "adm.eyebrow": "மாணவர் சேர்க்கை",
    "adm.title": "மாணவர்",
    "adm.titleHighlight": "சேர்க்கை",
    "adm.subtitle": "GGPS பள்ளியில் புதிய மாணவரைப் பதிவு செய்ய கீழே உள்ள விவரங்களைப் பூர்த்தி செய்யவும்.",
    "adm.step1": "மாணவர் விவரங்கள்",
    "adm.step2": "பெற்றோர் / பாதுகாவலர்",
    "adm.step3": "சரிபார்த்து சமர்ப்பிக்கவும்",
    "adm.firstName": "முதல் பெயர்",
    "adm.lastName": "குடும்பப் பெயர்",
    "adm.dob": "பிறந்த தேதி",
    "adm.gender": "பாலினம்",
    "adm.grade": "விண்ணப்பிக்கும் வகுப்பு",
    "adm.parentName": "பெற்றோர் / பாதுகாவலர் பெயர்",
    "adm.contactNumber": "தொடர்பு தொலைபேசி எண்",
    "adm.address": "முகவரி",
    "adm.next": "அடுத்த படி",
    "adm.back": "பின்செல்",
    "adm.submit": "விண்ணப்பத்தைச் சமர்ப்பிக்கவும்",
    "adm.cancel": "ரத்து செய்க",
  },

  de: {
    // Navigation
    "nav.home": "Startseite",
    "nav.admissions": "Zulassung",
    "nav.adminPortal": "Admin-Portal",
    "nav.parentPortal": "Elternportal",
    "nav.enrollNow": "Jetzt Anmelden",
    "nav.selectLanguage": "Sprache Wählen",

    // Hero Section
    "hero.badge": "Komplette Schul-ERP-Plattform",
    "hero.title1": "Intelligentere Schule",
    "hero.title2": "ERP-Plattform.",
    "hero.title3": "Nahtlose Abläufe.",
    "hero.title4": "Besseres Lernen.",
    "hero.subtitle": "Eine ganzheitliche Schul-ERP-Lösung zur Automatisierung von Zulassungen, Gebühreneinzügen, Anwesenheiten, Prüfungen und Gehaltsabrechnungen in Echtzeit.",
    "hero.trustedBy": "Von über 1.000 Schulen geschätzt",
    "hero.countries": "in über 20 Ländern",

    // Hero Floating Cards
    "card.attendance": "Schüleranwesenheit",
    "card.present": "Anwesend",
    "card.absent": "Abwesend",
    "card.total": "Gesamt",
    "card.performance": "Akademische Leistung",
    "card.timetable": "Klassen & Stundenplan",
    "card.exams": "Prüfungen & Noten",
    "card.fees": "Gebühren & Zahlungen",
    "card.reports": "Berichte & Analysen",
    "card.activeStudents": "Aktive Schüler",

    // Stats Section
    "stats.badge": "Warum GGPS School",
    "stats.title1": "Entwickelt für",
    "stats.title2": "Intelligentere Bildung",
    "stats.subtitle": "Leistungsstarke Tools und intelligente Automatisierung, um die Schulverwaltung für alle einfacher und schneller zu machen.",
    "stats.m1_badge": "Zuverlässig",
    "stats.m1_title": "Genaue Anwesenheit",
    "stats.m1_desc": "Echtzeit-Biometrie und Mobilprotokolle",
    "stats.m2_badge": "Automatisiert",
    "stats.m2_title": "Papierloser Gebühreneinzug",
    "stats.m2_desc": "Automatische Belege und Mahnungen",
    "stats.m3_badge": "Sofort",
    "stats.m3_title": "Zeugnisse & Stundenpläne",
    "stats.m3_desc": "Erstellung und Export mit 1 Klick",
    "stats.m4_badge": "24/7 Aktiv",
    "stats.m4_title": "Elternportal-Zugang",
    "stats.m4_desc": "Mobiles Tagebuch und Live-Updates",

    // Features Section
    "features.eyebrow": "EINE PLATTFORM. KOMPLETTES SCHULMANAGEMENT.",
    "features.title1": "Entwickelt für Moderne",
    "features.title2": "Akademische Exzellenz",
    "features.subtitle": "Alles, was Ihre Schule braucht, um reibungslos zu funktionieren und den Schulerfolg zu begleiten.",
    "features.smartAuto": "SMARTE AUTOMATISIERUNG",
    "features.intelOps": "Intelligente Abläufe",
    "features.intelOpsDesc": "Automatisieren Sie Stundenplanung, Zulassungen, Schülertransport und Gehaltsabrechnung ohne Papierkram.",
    "features.betterInsights": "BESSERE EINBLICKE",
    "features.perfRubrics": "Leistung & Bewertungsraster",
    "features.perfRubricsDesc": "Verfolgen Sie kognitive und akademische Meilensteine mit automatisierten Zeugnissen.",
    "features.safeConnected": "SICHER & VERNETZT",
    "features.secureConnected": "Sicher & Vernetzt",
    "features.secureConnectedDesc": "Rollenbasierte Zugriffskontrolle für Schulleiter, Lehrkräfte und Eltern mit Echtzeitbenachrichtigungen.",
    "features.exploreMore": "Mehr Erfahren",

    // CTA Banner
    "cta.eyebrow": "ENTWICKELT FÜR DIE ZUKUNFT DER BILDUNG",
    "cta.title1": "Transformieren Sie Ihre",
    "cta.title2": "Schule noch heute",
    "cta.subtitle": "Schließen Sie sich Hunderten von zukunftsorientierten Institutionen an, die E.A.S. Academy nutzen.",
    "cta.apply": "Für Zulassung Bewerben",
    "cta.signIn": "Admin-Anmeldung",

    // Footer
    "footer.desc": "Intelligente Schulverwaltungsplattform, die Zulassungen, Unterricht, Finanzen und Elternkommunikation vereint.",
    "footer.admissionsOpen": "Anmeldungen für 2026–2027 geöffnet",
    "footer.explore": "ERKUNDEN",
    "footer.management": "MANAGEMENT",
    "footer.contactSupport": "KONTAKT & SUPPORT",
    "footer.campusAddress": "E.A.S. Academy Campus, Hauptallee",
    "footer.applyOnline": "Online Bewerben",
    "footer.rights": "© 2026 E.A.S. Academy Schule. Alle Rechte vorbehalten.",
    "footer.verified": "Verifiziertes Schulportal",
    "footer.staffPortal": "Mitarbeiterportal",

    // Login Page
    "login.welcomeBack": "WILLKOMMEN ZURÜCK",
    "login.signInTitle": "Bei Ihrem Konto Anmelden",
    "login.signInSubtitle": "Greifen Sie auf das E.A.S. Academy Schulportal zu und verwalten Sie Ihren Bildungsweg.",
    "login.email": "E-Mail-Adresse",
    "login.password": "Passwort",
    "login.forgotPassword": "Passwort vergessen?",
    "login.rememberMe": "Angemeldet bleiben",
    "login.secureLogin": "Sichere Anmeldung",
    "login.signInBtn": "Anmelden",
    "login.signingIn": "Anmeldung läuft...",
    "login.or": "ODER",
    "login.google": "Weiter mit Google",
    "login.microsoft": "Weiter mit Microsoft",
    "login.noAccount": "Noch kein Konto?",
    "login.applyAdmission": "Für Zulassung bewerben",
    "login.backHome": "← Zurück zur Startseite",
    "login.heroTitle": "Exzellenz in der",
    "login.heroTitleHighlight": "Bildung.",
    "login.heroSubtitle": "Schließen Sie sich über 1.000 führenden Bildungseinrichtungen an.",

    // Admissions Page
    "adm.eyebrow": "SCHÜLEREINSCHREIBUNG",
    "adm.title": "Schüler-",
    "adm.titleHighlight": "Einschreibung",
    "adm.subtitle": "Füllen Sie die folgenden Angaben aus, um einen neuen Schüler an der GGPS School anzumelden.",
    "adm.step1": "Schülerdaten",
    "adm.step2": "Eltern / Erziehungsberechtigte",
    "adm.step3": "Überprüfen & Absenden",
    "adm.firstName": "VORNAME",
    "adm.lastName": "NACHNAME",
    "adm.dob": "GEBURTSDATUM",
    "adm.gender": "GESCHLECHT",
    "adm.grade": "BEWERBUNG FÜR KLASSENSTUFE",
    "adm.parentName": "NAME DES ELTERNTEILS",
    "adm.contactNumber": "KONTAKT-TELEFONNUMMER",
    "adm.address": "WOHNADRESSE",
    "adm.next": "Nächster Schritt",
    "adm.back": "Zurück",
    "adm.submit": "Bewerbung Absenden",
    "adm.cancel": "Zurücksetzen & Abbrechen",
  },

  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.admissions": "القبول والتسجيل",
    "nav.adminPortal": "بوابة الإدارة",
    "nav.parentPortal": "بوابة أولياء الأمور",
    "nav.enrollNow": "سجل الآن",
    "nav.selectLanguage": "اختر اللغة",

    // Hero Section
    "hero.badge": "منصة ERP المدرسية المتكاملة",
    "hero.title1": "مدرسة أكثر ذكاءً",
    "hero.title2": "منصة ERP المدرسية.",
    "hero.title3": "عمليات سلسة.",
    "hero.title4": "تعليم أفضل.",
    "hero.subtitle": "حل متكامل لإدارة المدارس لأتمتة القبول، وتحصيل الرسوم، والحضور، والامتحانات، والرواتب في الوقت الفعلي.",
    "hero.trustedBy": "موثوق به من أكثر من 1000 مدرسة",
    "hero.countries": "في أكثر من 20 دولة",

    // Hero Floating Cards
    "card.attendance": "حضور الطلاب",
    "card.present": "حاضر",
    "card.absent": "غائب",
    "card.total": "الإجمالي",
    "card.performance": "الأداء الأكاديمي",
    "card.timetable": "الفصول والجدول",
    "card.exams": "الامتحانات والنتائج",
    "card.fees": "الرسوم والمدفوعات",
    "card.reports": "التقارير والتحليلات",
    "card.activeStudents": "الطلاب النشطون",

    // Stats Section
    "stats.badge": "لماذا مدرسة GGPS؟",
    "stats.title1": "صُمم لـ",
    "stats.title2": "تعليم أكثر ذكاءً",
    "stats.subtitle": "أدوات قوية وأتمتة ذكية تجعل إدارة المدرسة أسهل وأسرع وأكثر كفاءة للجميع.",
    "stats.m1_badge": "موثوق",
    "stats.m1_title": "دقة الحضور",
    "stats.m1_desc": "سجلات بيومترية وجوالة فورية",
    "stats.m2_badge": "مؤتمت",
    "stats.m2_title": "تحصيل رسوم رقمي",
    "stats.m2_desc": "إيصالات وتذكيرات دفع مؤتمتة",
    "stats.m3_badge": "فوري",
    "stats.m3_title": "الشهادات والجداول",
    "stats.m3_desc": "إنشاء وتصدير بنقرة واحدة",
    "stats.m4_badge": "يعمل دائماً",
    "stats.m4_title": "بوابة أولياء الأمور 24/7",
    "stats.m4_desc": "مفكرة إلكترونية وتحديثات حية",

    // Features Section
    "features.eyebrow": "منصة واحدة. إدارة مدرسية متكاملة.",
    "features.title1": "مصمم لـ",
    "features.title2": "التميز الأكاديمي الحديث",
    "features.subtitle": "كل ما تحتاجه مدرستك للعمل بسلاسة، وإشراك أولياء الأمور، وتمكين المعلمين.",
    "features.smartAuto": "أتمتة ذكية",
    "features.intelOps": "عمليات ذكية",
    "features.intelOpsDesc": "أتمتة الجداول المدرسية وإجراءات القبول والنقل المدرسي والرواتب دون معاملات ورقية.",
    "features.betterInsights": "رؤى أفضل",
    "features.perfRubrics": "الأداء ومعايير التقييم",
    "features.perfRubricsDesc": "تتبع المراحل المعرفية والمهارية للطلاب مع شهادات وتقييمات مؤتمتة.",
    "features.safeConnected": "آمن ومتصل",
    "features.secureConnected": "آمن ومتصل",
    "features.secureConnectedDesc": "إدارة الصلاحيات للمديرين والمعلمين وأولياء الأمور مع إشعارات فورية وتنبيهات واتساب.",
    "features.exploreMore": "اكتشف المزيد",

    // CTA Banner
    "cta.eyebrow": "صُمم لمستقبل التعليم",
    "cta.title1": "غيّر مستقبل",
    "cta.title2": "مدرستك اليوم",
    "cta.subtitle": "انضم إلى مئات المؤسسات التعليمية الرائدة التي تستخدم أكاديمية E.A.S. للارتقاء بمعاييرها التعليمية.",
    "cta.apply": "التقديم للقبول",
    "cta.signIn": "تسجيل دخول الإدارة",

    // Footer
    "footer.desc": "منصة ذكية متكاملة لإدارة المدارس توحد القبول والتعليم والمالية والتواصل مع أولياء الأمور.",
    "footer.admissionsOpen": "باب القبول مفتوح لعام 2026–2027",
    "footer.explore": "استكشاف",
    "footer.management": "الإدارة",
    "footer.contactSupport": "الاتصال والدعم",
    "footer.campusAddress": "حرم أكاديمية E.A.S.، الشارع الرئيسي",
    "footer.applyOnline": "التقديم عبر الإنترنت",
    "footer.rights": "© 2026 مدرسة أكاديمية E.A.S. جميع الحقوق محفوظة.",
    "footer.verified": "بوابة مدرسية معتمدة",
    "footer.staffPortal": "بوابة الموظفين",

    // Login Page
    "login.welcomeBack": "مرحباً بعودتك",
    "login.signInTitle": "تسجيل الدخول إلى حسابك",
    "login.signInSubtitle": "الوصول إلى بوابة مدرسة أكاديمية E.A.S. ومتابعة مسيرتك التعليمية.",
    "login.email": "البريد الإلكتروني",
    "login.password": "كلمة المرور",
    "login.forgotPassword": "نسيت كلمة المرور؟",
    "login.rememberMe": "تذكرني",
    "login.secureLogin": "تسجيل دخول آمن",
    "login.signInBtn": "تسجيل الدخول",
    "login.signingIn": "جاري الدخول...",
    "login.or": "أو",
    "login.google": "المتابعة باستخدام Google",
    "login.microsoft": "المتابعة باستخدام Microsoft",
    "login.noAccount": "ليس لديك حساب؟",
    "login.applyAdmission": "التقديم للقبول",
    "login.backHome": "← العودة إلى الرئيسية",
    "login.heroTitle": "التميز في",
    "login.heroTitleHighlight": "التعليم.",
    "login.heroSubtitle": "انضم إلى أكثر من 1000 مؤسسة تعليمية رائدة في تبسيط الإدارة المدرسية.",

    // Admissions Page
    "adm.eyebrow": "تسجيل الطلاب",
    "adm.title": "تسجيل",
    "adm.titleHighlight": "الطلاب",
    "adm.subtitle": "يرجى تعبئة البيانات أدناه لتسجيل طالب جديد في مدرسة GGPS.",
    "adm.step1": "بيانات الطالب",
    "adm.step2": "ولي الأمر / الوصي",
    "adm.step3": "المراجعة والإرسال",
    "adm.firstName": "الاسم الأول",
    "adm.lastName": "اسم العائلة",
    "adm.dob": "تاريخ الميلاد",
    "adm.gender": "الجنس",
    "adm.grade": "الصف المتقدم له",
    "adm.parentName": "اسم ولي الأمر",
    "adm.contactNumber": "رقم الهاتف",
    "adm.address": "عنوان السكن",
    "adm.next": "الخطوة التالية",
    "adm.back": "رجوع",
    "adm.submit": "إرسال طلب التسجيل",
    "adm.cancel": "إلغاء ومسح",
  },
};

interface LanguageContextType {
  language: LanguageCode;
  currentLanguage: Language;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  languages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("language") as LanguageCode | null;
      if (stored && TRANSLATIONS[stored]) {
        setLanguageState(stored);
        applyLanguageToDOM(stored);
      }
    } catch (_) {
      // Ignore localStorage exceptions
    }
  }, []);

  const applyLanguageToDOM = (code: LanguageCode) => {
    const langObj = LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
    document.documentElement.lang = code;
    document.documentElement.dir = langObj.dir;
  };

  const setLanguage = (code: LanguageCode) => {
    if (!TRANSLATIONS[code]) return;
    setLanguageState(code);
    try {
      localStorage.setItem("language", code);
    } catch (_) {}
    applyLanguageToDOM(code);
  };

  const KEY_ALIASES: Record<string, string> = {
    "features.badge": "features.eyebrow",
    "features.c1_tag": "features.smartAuto",
    "features.c1_title": "features.intelOps",
    "features.c1_desc": "features.intelOpsDesc",
    "features.c1_link": "features.exploreMore",
    "features.c2_tag": "features.betterInsights",
    "features.c2_title": "features.perfRubrics",
    "features.c2_desc": "features.perfRubricsDesc",
    "features.c3_tag": "features.safeConnected",
    "features.c3_title": "features.secureConnected",
    "features.c3_desc": "features.secureConnectedDesc",
    "cta.badge": "cta.eyebrow",
    "footer.openAdmissions": "footer.admissionsOpen",
    "footer.location": "footer.campusAddress",
    "footer.contact": "footer.contactSupport",
    "login.welcome": "login.welcomeBack",
    "login.title": "login.signInTitle",
    "login.subtitle": "login.signInSubtitle",
    "login.signIn": "login.signInBtn",
    "login.apply": "login.applyAdmission",
  };

  const t = (key: string, fallback?: string): string => {
    const resolvedKey = KEY_ALIASES[key] || key;
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[resolvedKey]) {
      return langDict[resolvedKey];
    }
    // Fallback to English
    const enDict = TRANSLATIONS.en;
    if (enDict && enDict[resolvedKey]) {
      return enDict[resolvedKey];
    }
    return fallback || key;
  };

  const currentLanguage = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        currentLanguage,
        setLanguage,
        t,
        languages: LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
