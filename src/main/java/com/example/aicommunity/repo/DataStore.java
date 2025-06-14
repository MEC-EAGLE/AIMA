package com.example.aicommunity.repo;

import com.example.aicommunity.model.Job;
import com.example.aicommunity.model.User;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

public class DataStore {
    private static final Map<Long, User> users = new HashMap<>();
    private static final Map<Long, Job> jobs = new HashMap<>();
    private static final Map<Long, Set<Long>> applications = new HashMap<>();
    private static final AtomicLong userId = new AtomicLong(1);
    private static final AtomicLong jobId = new AtomicLong(1);

    static {
        jobs.put(1L, new Job(1L, "AI Engineer", "Work on cutting edge AI."));
        jobs.put(2L, new Job(2L, "Data Scientist", "Analyze data for insights."));
    }

    public static User addUser(String email, String phone, String password, String code) {
        Long id = userId.getAndIncrement();
        User user = new User(id, email, phone, password, code);
        users.put(id, user);
        return user;
    }

    public static User findUserByEmail(String email) {
        return users.values().stream()
            .filter(u -> u.getEmail().equals(email))
            .findFirst().orElse(null);
    }

    public static Collection<Job> getJobs() { return jobs.values(); }
    public static Job getJob(Long id) { return jobs.get(id); }

    public static void applyForJob(Long userId, Long jobId) {
        applications.computeIfAbsent(userId, k -> new HashSet<>()).add(jobId);
    }

    public static void withdrawApplication(Long userId, Long jobId) {
        Set<Long> apps = applications.get(userId);
        if (apps != null) {
            apps.remove(jobId);
        }
    }

    public static Set<Long> getApplications(Long userId) {
        return applications.getOrDefault(userId, Collections.emptySet());
    }
}
