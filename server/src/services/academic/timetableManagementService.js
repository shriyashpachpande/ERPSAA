const TimetableEntry = require('../../models/academic/AcademicTimetableEntry');
const FacultyProfile = require('../../models/academic/FacultyProfile');
const AcademicSection = require('../../models/academic/AcademicSection');

/**
 * Checks if two time ranges overlap
 * Formats: HH:mm
 */
const isTimeOverlapping = (start1, end1, start2, end2) => {
    return start1 < end2 && start2 < end1;
};

exports.checkConflicts = async (data, excludeId = null) => {
    const { academicYearId, dayOfWeek, startTime, endTime, facultyId, sectionId, roomNumber } = data;
    
    // Find potential conflicting entries in the same year and day
    const entries = await TimetableEntry.find({
        academicYearId,
        dayOfWeek,
        _id: { $ne: excludeId }
    });

    for (const entry of entries) {
        if (isTimeOverlapping(startTime, endTime, entry.startTime, entry.endTime)) {
            // Faculty and Room conflicts are GLOBAL within an academic year 
            // because they happen at the same physical time/place regardless of semester
            if (entry.facultyId && facultyId && entry.facultyId.toString() === facultyId.toString()) {
                return { conflict: true, message: `Faculty conflict: Assigned to another class during this time (${entry.startTime}-${entry.endTime})` };
            }
            if (entry.roomNumber && roomNumber && entry.roomNumber === roomNumber) {
                return { conflict: true, message: `Room conflict: ${roomNumber} is already occupied (${entry.startTime}-${entry.endTime})` };
            }
            
            // Section conflict is semester-specific, but sectionId is already semester-bound
            if (entry.sectionId && sectionId && entry.sectionId.toString() === sectionId.toString()) {
                if (entry.semesterId?.toString() === data.semesterId?.toString()) {
                    return { conflict: true, message: `Section conflict: This section already has a class scheduled (${entry.startTime}-${entry.endTime})` };
                }
            }
        }
    }

    return { conflict: false };
};

exports.createEntry = async (data, userId) => {
    const conflictCheck = await this.checkConflicts(data);
    if (conflictCheck.conflict) throw new Error(conflictCheck.message);

    return await TimetableEntry.create({ ...data, createdBy: userId });
};

exports.getEntries = async (filters = {}, currentUser = null) => {
    let query = {};
    
    for (const [key, value] of Object.entries(filters)) {
        if (value) {
            query[key] = value;
        }
    }

    // Role-based filtering for HOD - Enforce department ownership
    if (currentUser && currentUser.role === 'hod') {
        const hodProfile = await FacultyProfile.findOne({ user: currentUser.id });
        if (hodProfile) {
            const sections = await AcademicSection.find({ department: hodProfile.department }).select('_id');
            const sectionIds = sections.map(s => s._id);
            
            if (query.sectionId) {
                // If a specific section was requested, verify it belongs to HOD's department
                const isAllowed = sectionIds.some(id => id.toString() === query.sectionId.toString());
                if (!isAllowed) {
                    return []; // Unauthorized: Section belongs to another department
                }
            } else {
                // No specific section requested, show all sections in HOD's department
                query.sectionId = { $in: sectionIds };
            }
        } else {
            // HOD with no profile assigned see nothing
            return [];
        }
    }

    return await TimetableEntry.find(query)
        .populate('academicYearId', 'name')
        .populate('semesterId', 'semesterName semesterNumber')
        .populate('sectionId', 'name')
        .populate('subjectId', 'subjectName subjectCode')
        .populate({
            path: 'facultyId',
            select: 'employeeId',
            populate: {
                path: 'user',
                select: 'fullName'
            }
        })
        .sort({ dayOfWeek: 1, startTime: 1 });
};

exports.getEntryById = async (id, currentUser = null) => {
    const entry = await TimetableEntry.findById(id)
        .populate('academicYearId', 'name')
        .populate('semesterId', 'semesterName')
        .populate('sectionId', 'name department')
        .populate('subjectId', 'subjectName subjectCode')
        .populate({
            path: 'facultyId',
            populate: {
                path: 'user',
                select: 'fullName email profilePicture'
            }
        });

    if (!entry) return null;

    // Role-based filtering for HOD
    if (currentUser && currentUser.role === 'hod') {
        const hodProfile = await FacultyProfile.findOne({ user: currentUser.id });
        if (!hodProfile || entry.sectionId?.department !== hodProfile.department) {
            return null; // Unauthorized or mismatch
        }
    }

    return entry;
};

exports.updateEntry = async (id, data, userId) => {
    const conflictCheck = await this.checkConflicts(data, id);
    if (conflictCheck.conflict) throw new Error(conflictCheck.message);

    return await TimetableEntry.findByIdAndUpdate(id, { ...data, updatedBy: userId }, { new: true, runValidators: true });
};

exports.deleteEntry = async (id) => {
    return await TimetableEntry.findByIdAndDelete(id);
};

exports.getSectionTimetable = async (sectionId, currentUser = null) => {
    // 1. Resolve the target section to get its name for matching
    const targetSection = await AcademicSection.findById(sectionId);
    if (!targetSection) return [];

    const enrolledSectionName = targetSection.name.trim().toLowerCase();

    // 2. Fetch all sections that match this name WITHIN the same Academic Year and Semester
    const matchingSections = await AcademicSection.find({
        name: { $regex: new RegExp(`^${targetSection.name.trim()}$`, 'i') },
        academicYearId: targetSection.academicYearId,
        semesterId: targetSection.semesterId
    }).select('_id');
    
    const sectionIds = matchingSections.map(s => s._id);

    // 3. Role-based filtering for HOD
    if (currentUser && currentUser.role === 'hod') {
        const hodProfile = await FacultyProfile.findOne({ user: currentUser.id });
        if (hodProfile) {
            if (targetSection.department !== hodProfile.department) {
                return []; // Unauthorized
            }
        } else {
            return [];
        }
    }

    // 4. Fetch entries matching any of the resolved section IDs AND the specific semester/year
    return await TimetableEntry.find({ 
        sectionId: { $in: sectionIds },
        academicYearId: targetSection.academicYearId,
        semesterId: targetSection.semesterId
    })
    .populate('subjectId', 'subjectName subjectCode')
    .populate({
        path: 'facultyId',
        select: 'employeeId',
        populate: {
            path: 'user',
            select: 'fullName'
        }
    })
    .sort({ dayOfWeek: 1, startTime: 1 });
};

exports.getFacultyTimetable = async (facultyId) => {
    return await TimetableEntry.find({ facultyId, timetableStatus: 'active' })
        .populate('sectionId', 'name')
        .populate('subjectId', 'subjectName subjectCode')
        .sort({ dayOfWeek: 1, startTime: 1 });
};
