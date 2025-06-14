package com.example.aicommunity.controller;

import com.example.aicommunity.repo.DataStore;
import com.example.aicommunity.model.Job;
import com.example.aicommunity.model.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Set;
import java.util.Objects;
import java.util.stream.Collectors;

@Controller
public class JobController {

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        User user = (User) session.getAttribute("user");
        if (user == null) return "redirect:/login";
        model.addAttribute("user", user);
        return "dashboard";
    }

    @GetMapping("/jobs")
    public String jobs(@RequestParam(required = false) String q, Model model, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) return "redirect:/login";
        List<Job> jobs = DataStore.getJobs().stream()
                .filter(j -> q == null || j.getTitle().toLowerCase().contains(q.toLowerCase()))
                .collect(Collectors.toList());
        Set<Long> apps = DataStore.getApplications(user.getId());
        model.addAttribute("jobs", jobs);
        model.addAttribute("applications", apps);
        model.addAttribute("search", q == null ? "" : q);
        return "jobs";
    }

    @GetMapping("/apply/{id}")
    public String apply(@PathVariable Long id, Model model, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) return "redirect:/login";
        Job job = DataStore.getJob(id);
        if (job != null) {
            DataStore.applyForJob(user.getId(), id);
            model.addAttribute("message", "Applied for " + job.getTitle());
        }
        return "redirect:/jobs";
    }

    @GetMapping("/withdraw/{id}")
    public String withdraw(@PathVariable Long id, Model model, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) return "redirect:/login";
        Job job = DataStore.getJob(id);
        if (job != null) {
            DataStore.withdrawApplication(user.getId(), id);
            model.addAttribute("message", "Withdrawn application for " + job.getTitle());
        }
        return "redirect:/jobs";
    }

    @GetMapping("/applications")
    public String applications(Model model, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) return "redirect:/login";
        Set<Long> appIds = DataStore.getApplications(user.getId());
        List<Job> apps = appIds.stream()
                .map(DataStore::getJob)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        model.addAttribute("jobs", apps);
        return "applications";
    }
}
