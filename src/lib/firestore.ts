// Firestore Database Helper Functions
// ============================================
// CRUD operations for app management

import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    writeBatch,
    Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Collection name for apps - CHANGED to reset database
const APPS_COLLECTION = "learning_resources";

// กลุ่มสาระการเรียนรู้ 9 กลุ่ม ตามหลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน + ความรู้ทั่วไป
export type SubjectCategory =
    | "general"        // ความรู้ทั่วไป
    | "thai"           // ภาษาไทย
    | "math"           // คณิตศาสตร์
    | "science"        // วิทยาศาสตร์และเทคโนโลยี
    | "social"         // สังคมศึกษา ศาสนาและวัฒนธรรม
    | "foreign"        // ภาษาต่างประเทศ
    | "guidance"       // แนะแนว
    | "health"         // สุขศึกษาและพลศึกษา
    | "arts"           // ศิลปะ
    | "career";        // การงานอาชีพ

// Initial Seed Data
export const INITIAL_DATA: Array<Omit<AppDocument, "id" | "createdAt" | "updatedAt">> = [
    { name: "ความรู้รอบตัวน่ารู้", category: "general", zone: "student", url: "#", iconUrl: "", color: "from-fuchsia-500 to-purple-600", order: 0, isEnabled: true },
    { name: "ภาษาไทยพื้นฐาน", category: "thai", zone: "student", url: "#", iconUrl: "", color: "from-green-500 to-emerald-600", order: 1, isEnabled: true },
    { name: "คณิตศาสตร์ ม.ต้น", category: "math", zone: "student", url: "#", iconUrl: "", color: "from-blue-500 to-cyan-600", order: 2, isEnabled: true },
    { name: "วิทยาศาสตร์ทั่วไป", category: "science", zone: "student", url: "#", iconUrl: "", color: "from-teal-500 to-cyan-600", order: 3, isEnabled: true },
    { name: "สังคมศึกษาฯ", category: "social", zone: "student", url: "#", iconUrl: "", color: "from-orange-500 to-amber-600", order: 4, isEnabled: true },
    { name: "English for Communication", category: "foreign", zone: "student", url: "#", iconUrl: "", color: "from-purple-500 to-violet-600", order: 5, isEnabled: true },
    { name: "แนะแนวอาชีพ", category: "guidance", zone: "student", url: "#", iconUrl: "", color: "from-pink-500 to-rose-600", order: 6, isEnabled: true },
    { name: "สุขศึกษาและพลศึกษา", category: "health", zone: "student", url: "#", iconUrl: "", color: "from-green-600 to-emerald-700", order: 7, isEnabled: true },
    { name: "ศิลปะและการออกแบบ", category: "arts", zone: "student", url: "#", iconUrl: "", color: "from-yellow-500 to-amber-500", order: 8, isEnabled: true },
    { name: "การงานอาชีพ", category: "career", zone: "student", url: "#", iconUrl: "", color: "from-brown-500 to-orange-900", order: 9, isEnabled: true },
];

// ชื่อภาษาไทยของแต่ละกลุ่มสาระ
export const CATEGORY_NAMES: Record<SubjectCategory, string> = {
    general: "ความรู้ทั่วไป",
    thai: "ภาษาไทย",
    math: "คณิตศาสตร์",
    science: "วิทยาศาสตร์และเทคโนโลยี",
    social: "สังคมศึกษา ศาสนาและวัฒนธรรม",
    foreign: "ภาษาต่างประเทศ",
    guidance: "แนะแนว",
    health: "สุขศึกษาและพลศึกษา",
    arts: "ศิลปะ",
    career: "การงานอาชีพ",
};

// สีของแต่ละกลุ่มสาระ (สีเขียวโทนต่างๆ)
export const CATEGORY_COLORS: Record<SubjectCategory, { bg: string; text: string; icon: string }> = {
    general: { bg: "#f3e5f5", text: "#6a1b9a", icon: "#8e24aa" },
    thai: { bg: "#e8f5e9", text: "#2e7d32", icon: "#43a047" },
    math: { bg: "#e3f2fd", text: "#1565c0", icon: "#1e88e5" },
    science: { bg: "#e0f7fa", text: "#00838f", icon: "#00acc1" },
    social: { bg: "#fff3e0", text: "#ef6c00", icon: "#fb8c00" },
    foreign: { bg: "#f3e5f5", text: "#7b1fa2", icon: "#9c27b0" },
    guidance: { bg: "#fce4ec", text: "#c2185b", icon: "#e91e63" },
    health: { bg: "#e8f5e9", text: "#388e3c", icon: "#4caf50" },
    arts: { bg: "#fff8e1", text: "#f9a825", icon: "#fbc02d" },
    career: { bg: "#efebe9", text: "#5d4037", icon: "#795548" },
};

// App data interface matching the existing AppData type
export interface AppDocument {
    id?: string;
    name: string;
    url: string;
    iconUrl: string;
    zone: "student" | "teacher" | "both";
    category?: SubjectCategory; // กลุ่มสาระการเรียนรู้
    color?: string;
    order: number;
    isEnabled?: boolean; // Default is true (enabled)
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

/**
 * Get all apps from Firestore, ordered by 'order' field
 */
export async function getApps(): Promise<AppDocument[]> {
    try {
        const appsRef = collection(db, APPS_COLLECTION);
        const q = query(appsRef, orderBy("order", "asc"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as AppDocument[];
    } catch (error) {
        console.error("Error fetching apps:", error);
        throw new Error("Failed to fetch apps");
    }
}

/**
 * Get a single app by ID
 */
export async function getAppById(appId: string): Promise<AppDocument | null> {
    try {
        const docRef = doc(db, APPS_COLLECTION, appId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as AppDocument;
        }
        return null;
    } catch (error) {
        console.error("Error fetching app:", error);
        throw new Error("Failed to fetch app");
    }
}

/**
 * Add a new app to Firestore
 */
export async function addApp(
    appData: Omit<AppDocument, "id" | "order" | "createdAt" | "updatedAt">
): Promise<string> {
    try {
        // Get the current highest order
        const apps = await getApps();
        const maxOrder = apps.length > 0 ? Math.max(...apps.map((a) => a.order || 0)) : -1;

        const newApp = {
            ...appData,
            order: maxOrder + 1,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, APPS_COLLECTION), newApp);
        console.log("App added with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding app:", error);
        throw new Error("Failed to add app");
    }
}

/**
 * Update an existing app
 */
export async function updateApp(
    appId: string,
    appData: Partial<Omit<AppDocument, "id" | "createdAt">>
): Promise<void> {
    try {
        const docRef = doc(db, APPS_COLLECTION, appId);
        await updateDoc(docRef, {
            ...appData,
            updatedAt: Timestamp.now(),
        });
        console.log("App updated:", appId);
    } catch (error) {
        console.error("Error updating app:", error);
        throw new Error("Failed to update app");
    }
}

/**
 * Delete an app from Firestore
 */
export async function deleteApp(appId: string): Promise<void> {
    try {
        const docRef = doc(db, APPS_COLLECTION, appId);
        await deleteDoc(docRef);
        console.log("App deleted:", appId);
    } catch (error) {
        console.error("Error deleting app:", error);
        throw new Error("Failed to delete app");
    }
}

/**
 * Reorder an app (move up or down in the list)
 * @param appId - The ID of the app to move
 * @param direction - 'up' to decrease order, 'down' to increase order
 */
export async function reorderApp(
    appId: string,
    direction: "up" | "down"
): Promise<void> {
    try {
        // Get all apps sorted by order
        const apps = await getApps();
        const currentIndex = apps.findIndex((a) => a.id === appId);

        if (currentIndex === -1) {
            throw new Error("App not found");
        }

        // Calculate the target index
        const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

        // Check bounds
        if (targetIndex < 0 || targetIndex >= apps.length) {
            console.log("Cannot move further in this direction");
            return;
        }

        // Get the apps to swap
        const currentApp = apps[currentIndex];
        const targetApp = apps[targetIndex];

        // Swap the order values using a batch write
        const batch = writeBatch(db);

        const currentDocRef = doc(db, APPS_COLLECTION, currentApp.id!);
        const targetDocRef = doc(db, APPS_COLLECTION, targetApp.id!);

        batch.update(currentDocRef, {
            order: targetApp.order,
            updatedAt: Timestamp.now(),
        });
        batch.update(targetDocRef, {
            order: currentApp.order,
            updatedAt: Timestamp.now(),
        });

        await batch.commit();
        console.log("Apps reordered successfully");
    } catch (error) {
        console.error("Error reordering app:", error);
        throw new Error("Failed to reorder app");
    }
}

/**
 * Normalize order values (useful after deletions to keep orders sequential)
 */
export async function normalizeAppOrders(): Promise<void> {
    try {
        const apps = await getApps();
        const batch = writeBatch(db);

        apps.forEach((app, index) => {
            if (app.order !== index) {
                const docRef = doc(db, APPS_COLLECTION, app.id!);
                batch.update(docRef, { order: index });
            }
        });

        await batch.commit();
        console.log("App orders normalized");
    } catch (error) {
        console.error("Error normalizing orders:", error);
    }
}

/**
 * Initialize database with default 9 category items if empty
 */
export async function initializeDatabase(): Promise<void> {
    try {
        const apps = await getApps();
        if (apps.length > 0) {
            console.log("Database already has data, skipping initialization");
            return;
        }

        console.log("Initializing database with default data...");
        for (const item of INITIAL_DATA) {
            await addApp(item);
        }
        console.log("Database initialization complete!");
    } catch (error) {
        console.error("Failed to initialize database:", error);
        throw error;
    }
}
