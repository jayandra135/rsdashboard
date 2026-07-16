"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Select, { type StylesConfig } from "react-select";
import { z } from "zod";

import type { JobPayload } from "@/services/admin";
import { createAdminJob, updateAdminJob } from "@/services/admin";
import { getCategories, getCompanies, getLocations, getSkills } from "@/services/jobs";
import type { JobSummary } from "@/types/job";

type SelectOption = { value: string; label: string };

const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 48,
    borderRadius: 12,
    borderColor: state.isFocused ? "#2563eb" : "#e2e8f0",
    boxShadow: "none",
    "&:hover": { borderColor: state.isFocused ? "#2563eb" : "#e2e8f0" },
  }),
  valueContainer: (base) => ({ ...base, padding: "0 16px" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8" }),
  menu: (base) => ({ ...base, borderRadius: 12, overflow: "hidden", zIndex: 20 }),
};

const statusOptions: SelectOption[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "CLOSED", label: "Closed" },
  { value: "ARCHIVED", label: "Archived" },
];

const employmentTypeOptions: SelectOption[] = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "TEMPORARY", label: "Temporary" },
];

const workplaceTypeOptions: SelectOption[] = [
  { value: "ONSITE", label: "Onsite" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
];

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

  const companyOptions: SelectOption[] =
    companiesQuery.data?.map((company) => ({ value: company.id, label: company.name })) ?? [];
  const categoryOptions: SelectOption[] =
    categoriesQuery.data?.map((category) => ({ value: category.id, label: category.name })) ?? [];
  const locationOptions: SelectOption[] =
    locationsQuery.data?.map((location) => ({
      value: location.id,
      label: [location.city, location.state, location.country].filter(Boolean).join(", "),
    })) ?? [];

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
        <Controller
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <Select
              inputId="companyId"
              options={companyOptions}
              value={companyOptions.find((option) => option.value === field.value) ?? null}
              onChange={(option) => field.onChange(option?.value ?? "")}
              onBlur={field.onBlur}
              placeholder="Select company"
              isClearable
              styles={selectStyles}
            />
          )}
        />
        <Controller
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <Select
              inputId="categoryId"
              options={categoryOptions}
              value={categoryOptions.find((option) => option.value === field.value) ?? null}
              onChange={(option) => field.onChange(option?.value ?? "")}
              onBlur={field.onBlur}
              placeholder="Select category"
              isClearable
              styles={selectStyles}
            />
          )}
        />
        <Controller
          control={form.control}
          name="locationId"
          render={({ field }) => (
            <Select
              inputId="locationId"
              options={locationOptions}
              value={locationOptions.find((option) => option.value === field.value) ?? null}
              onChange={(option) => field.onChange(option?.value ?? "")}
              onBlur={field.onBlur}
              placeholder="Select location"
              isClearable
              styles={selectStyles}
            />
          )}
        />
        <Controller
          control={form.control}
          name="status"
          render={({ field }) => (
            <Select
              inputId="status"
              options={statusOptions}
              value={statusOptions.find((option) => option.value === field.value) ?? null}
              onChange={(option) => field.onChange(option?.value ?? "DRAFT")}
              onBlur={field.onBlur}
              placeholder="Select status"
              styles={selectStyles}
            />
          )}
        />
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
        <Controller
          control={form.control}
          name="employmentType"
          render={({ field }) => (
            <Select
              inputId="employmentType"
              options={employmentTypeOptions}
              value={employmentTypeOptions.find((option) => option.value === field.value) ?? null}
              onChange={(option) => field.onChange(option?.value ?? "FULL_TIME")}
              onBlur={field.onBlur}
              placeholder="Employment type"
              styles={selectStyles}
            />
          )}
        />
        <Controller
          control={form.control}
          name="workplaceType"
          render={({ field }) => (
            <Select
              inputId="workplaceType"
              options={workplaceTypeOptions}
              value={workplaceTypeOptions.find((option) => option.value === field.value) ?? null}
              onChange={(option) => field.onChange(option?.value ?? "HYBRID")}
              onBlur={field.onBlur}
              placeholder="Workplace type"
              styles={selectStyles}
            />
          )}
        />
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
