"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

import type { JobPayload } from "@/services/admin";
import { createAdminJob, updateAdminJob } from "@/services/admin";
import { getCategories, getCompanies, getLocations, getSkills } from "@/services/jobs";
import type { JobSummary } from "@/types/job";

const jobFormSchema = z.object({
  companyId: z.string().uuid(),
  categoryId: z.string().uuid(),
  locationId: z.string().uuid(),
  title: z.string().min(3),
  slug: z.string().min(3),
  summary: z.string().optional(),
  description: z.string().min(20),
  responsibilities: z.string().min(1),
  requirements: z.string().min(1),
  benefits: z.string().optional(),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  salaryCurrency: z.string().default("INR"),
  experienceMinYears: z.coerce.number().optional(),
  experienceMaxYears: z.coerce.number().optional(),
  experienceLevel: z.string().optional(),
  employmentType: z.string(),
  workplaceType: z.string(),
  isRemote: z.boolean().default(false),
  applyUrl: z.string().url(),
  recruiterName: z.string().optional(),
  recruiterEmail: z.string().email().optional().or(z.literal("")),
  recruiterLinkedinUrl: z.string().url().optional().or(z.literal("")),
  referralAvailable: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  status: z.string().default("DRAFT"),
  skillIds: z.array(z.string()).default([]),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toPayload(values: JobFormValues): JobPayload {
  return {
    companyId: values.companyId,
    categoryId: values.categoryId,
    locationId: values.locationId,
    title: values.title,
    slug: values.slug,
    summary: values.summary,
    description: values.description,
    responsibilities: splitLines(values.responsibilities),
    requirements: splitLines(values.requirements),
    benefits: values.benefits ? splitLines(values.benefits) : undefined,
    salaryMin: values.salaryMin,
    salaryMax: values.salaryMax,
    salaryCurrency: values.salaryCurrency,
    experienceMinYears: values.experienceMinYears,
    experienceMaxYears: values.experienceMaxYears,
    experienceLevel: values.experienceLevel,
    employmentType: values.employmentType,
    workplaceType: values.workplaceType,
    isRemote: values.isRemote,
    applyUrl: values.applyUrl,
    recruiterName: values.recruiterName,
    recruiterEmail: values.recruiterEmail || undefined,
    recruiterLinkedinUrl: values.recruiterLinkedinUrl || undefined,
    referralAvailable: values.referralAvailable,
    isFeatured: values.isFeatured,
    status: values.status,
    skillIds: values.skillIds,
  };
}

function jobToDefaults(job?: JobSummary): Partial<JobFormValues> {
  if (!job) {
    return {
      salaryCurrency: "INR",
      employmentType: "FULL_TIME",
      workplaceType: "HYBRID",
      status: "DRAFT",
      skillIds: [],
      isRemote: false,
      referralAvailable: false,
      isFeatured: false,
    };
  }

  return {
    companyId: job.company.id,
    categoryId: job.category.id,
    locationId: job.location.id,
    title: job.title,
    slug: job.slug,
    summary: job.summary ?? "",
    description: job.description,
    responsibilities: Array.isArray(job.responsibilities)
      ? job.responsibilities.join("\n")
      : "",
    requirements: Array.isArray(job.requirements) ? job.requirements.join("\n") : "",
    benefits: Array.isArray(job.benefits) ? job.benefits.join("\n") : "",
    salaryMin: job.salaryMin ?? undefined,
    salaryMax: job.salaryMax ?? undefined,
    salaryCurrency: job.salaryCurrency,
    experienceMinYears: job.experienceMinYears ?? undefined,
    experienceMaxYears: job.experienceMaxYears ?? undefined,
    employmentType: job.employmentType,
    workplaceType: job.workplaceType,
    isRemote: job.isRemote,
    applyUrl: job.applyUrl,
    recruiterName: job.recruiterName ?? "",
    recruiterEmail: job.recruiterEmail ?? "",
    recruiterLinkedinUrl: job.recruiterLinkedinUrl ?? "",
    referralAvailable: job.referralAvailable,
    isFeatured: job.isFeatured,
    status: job.status,
    skillIds: job.skills.map((entry) => entry.skill.id),
  };
}

const inputClassName =
  "rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500";

export function JobForm({ job }: { job?: JobSummary }) {
  const router = useRouter();
  const companiesQuery = useQuery({ queryKey: ["companies"], queryFn: getCompanies });
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const locationsQuery = useQuery({ queryKey: ["locations"], queryFn: getLocations });
  const skillsQuery = useQuery({ queryKey: ["skills"], queryFn: getSkills });

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: jobToDefaults(job) as JobFormValues,
  });

  async function onSubmit(values: JobFormValues) {
    const payload = toPayload(values);

    try {
      if (job) {
        await updateAdminJob(job.id, payload);
        toast.success("Job updated");
      } else {
        await createAdminJob(payload);
        toast.success("Job created");
      }
      router.push("/dashboard/jobs");
      router.refresh();
    } catch {
      toast.error("Unable to save job");
    }
  }

  const selectedSkills = form.watch("skillIds");

  function toggleSkill(skillId: string) {
    const current = form.getValues("skillIds");
    form.setValue(
      "skillIds",
      current.includes(skillId) ? current.filter((id) => id !== skillId) : [...current, skillId],
    );
  }

  return (
    <form
      onSubmit={(event) => {
        void form.handleSubmit(onSubmit)(event);
      }}
      className="card-surface grid gap-6 p-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <select {...form.register("companyId")} className={inputClassName}>
          <option value="">Select company</option>
          {companiesQuery.data?.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        <select {...form.register("categoryId")} className={inputClassName}>
          <option value="">Select category</option>
          {categoriesQuery.data?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select {...form.register("locationId")} className={inputClassName}>
          <option value="">Select location</option>
          {locationsQuery.data?.map((location) => (
            <option key={location.id} value={location.id}>
              {[location.city, location.state, location.country].filter(Boolean).join(", ")}
            </option>
          ))}
        </select>
        <select {...form.register("status")} className={inputClassName}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="CLOSED">Closed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input {...form.register("title")} placeholder="Job title" className={inputClassName} />
        <input {...form.register("slug")} placeholder="job-slug" className={inputClassName} />
      </div>

      <input {...form.register("summary")} placeholder="Short summary" className={inputClassName} />
      <textarea
        {...form.register("description")}
        placeholder="Job description"
        className={`${inputClassName} min-h-32`}
      />
      <textarea
        {...form.register("responsibilities")}
        placeholder="Responsibilities (one per line)"
        className={`${inputClassName} min-h-28`}
      />
      <textarea
        {...form.register("requirements")}
        placeholder="Requirements (one per line)"
        className={`${inputClassName} min-h-28`}
      />
      <textarea
        {...form.register("benefits")}
        placeholder="Benefits (one per line)"
        className={`${inputClassName} min-h-24`}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <input {...form.register("salaryMin")} type="number" placeholder="Min salary" className={inputClassName} />
        <input {...form.register("salaryMax")} type="number" placeholder="Max salary" className={inputClassName} />
        <input {...form.register("salaryCurrency")} placeholder="Currency" className={inputClassName} />
        <input
          {...form.register("experienceMinYears")}
          type="number"
          placeholder="Min experience"
          className={inputClassName}
        />
        <input
          {...form.register("experienceMaxYears")}
          type="number"
          placeholder="Max experience"
          className={inputClassName}
        />
        <select {...form.register("employmentType")} className={inputClassName}>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="FREELANCE">Freelance</option>
          <option value="TEMPORARY">Temporary</option>
        </select>
        <select {...form.register("workplaceType")} className={inputClassName}>
          <option value="ONSITE">Onsite</option>
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
        </select>
        <input {...form.register("applyUrl")} placeholder="Apply URL" className={inputClassName} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <input {...form.register("recruiterName")} placeholder="Recruiter name" className={inputClassName} />
        <input {...form.register("recruiterEmail")} placeholder="Recruiter email" className={inputClassName} />
        <input
          {...form.register("recruiterLinkedinUrl")}
          placeholder="Recruiter LinkedIn URL"
          className={inputClassName}
        />
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-slate-700">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...form.register("isRemote")} />
          Remote
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...form.register("referralAvailable")} />
          Referral available
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...form.register("isFeatured")} />
          Featured
        </label>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-slate-700">Skills</p>
        <div className="flex flex-wrap gap-2">
          {skillsQuery.data?.map((skill) => {
            const active = selectedSkills.includes(skill.id);
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => toggleSkill(skill.id)}
                className={`rounded-full px-3 py-1 text-sm ${
                  active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {skill.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="btn-primary">
          {job ? "Update Job" : "Create Job"}
        </button>
        <button type="button" onClick={() => router.push("/dashboard/jobs")} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
