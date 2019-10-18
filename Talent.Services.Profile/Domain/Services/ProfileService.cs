using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
        }

        public bool AddNewLanguage(AddLanguageViewModel language)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            User userProfile = (await _userRepository.GetByIdAsync(Id));
            var videoUrl = "";
            var CvUrl = "";

            if (userProfile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(userProfile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(userProfile.VideoName, FileType.UserVideo);
                CvUrl = string.IsNullOrWhiteSpace(userProfile.CvName)
                          ? ""
                          : await _fileService.GetFileURL(userProfile.CvName, FileType.UserCV);
                var skills = userProfile.Skills.Where(x => x.IsDeleted == false).Select(x => ViewModelFromSkill(x)).ToList();
                var languages = userProfile.Languages.Where(x => x.IsDeleted == false).Select(x => ViewModelFromLanguage(x)).ToList();
              //  var education = userProfile.Education.Where(x => x.IsDeleted == false).Select(x => ViewModelFromEducation(x)).ToList();
              //  var certifications = userProfile.Certifications.Where(x => x.IsDeleted == false).Select(x => ViewModelFromCertification(x)).ToList();
                var experience = userProfile.Experience.Select(x => ViewModelFromExperience(x)).ToList();

                var results = new TalentProfileViewModel()
                {
                    Id = userProfile.Id,
                    FirstName = userProfile.FirstName,
                    MiddleName = userProfile.MiddleName,
                    LastName = userProfile.LastName,
                    Gender = userProfile.Gender,
                    Email = userProfile.Email,
                    Phone = userProfile.Phone,
                    MobilePhone = userProfile.MobilePhone,
                    IsMobilePhoneVerified = userProfile.IsMobilePhoneVerified,
                    Address = userProfile.Address,
                    Nationality = userProfile.Nationality,
                    VisaStatus = userProfile.VisaStatus,
                    VisaExpiryDate = userProfile.VisaExpiryDate,
                    ProfilePhoto = userProfile.ProfilePhoto,
                    ProfilePhotoUrl = userProfile.ProfilePhotoUrl,
                    VideoName = userProfile.VideoName,
                    VideoUrl = videoUrl,
                    CvName = userProfile.CvName,
                    CvUrl = CvUrl,
                    Summary = userProfile.Summary,
                    Description = userProfile.Description,
                    LinkedAccounts = userProfile.LinkedAccounts,
                    JobSeekingStatus = userProfile.JobSeekingStatus,
                    Languages = languages,
                    Skills = skills,
                    //Education = education,
                    //Certifications = certifications,
                    Experience = experience
                };

                return results;
            }
            return null;
            //Your code here;
           // throw new NotImplementedException();
        }
        protected AddLanguageViewModel ViewModelFromLanguage(UserLanguage language)
        {
            return new AddLanguageViewModel
            {
                Id = language.Id,
                CurrentUserId = language.UserId,
                Level = language.LanguageLevel,
                Name = language.Language
            };
        }
        protected ExperienceViewModel ViewModelFromExperience(UserExperience experience)
        {
            return new ExperienceViewModel
            {
                Id = experience.Id,
                Company = experience.Company,
                Position = experience.Position,
                Responsibilities = experience.Responsibilities,
                Start = experience.Start,
                End = experience.End
            };
        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel model, string updaterId)
        {
            try
            {
                if (model.Id != null)
                {
                    var user = (await _userRepository.GetByIdAsync(updaterId));
                    user.LinkedAccounts = model.LinkedAccounts;
                    user.Summary = model.Summary;
                    user.Description = model.Description;
                    user.FirstName = model.FirstName;
                    user.LastName = model.LastName;
                    user.Email = model.Email;
                    user.Phone = model.Phone;
                    user.Address = model.Address;
                    user.Nationality = model.Nationality;
                    user.VisaStatus = model.VisaStatus;
                    user.VisaExpiryDate = model.VisaExpiryDate;
                    user.JobSeekingStatus = model.JobSeekingStatus;

                    var newLanguage = new List<UserLanguage>();
                    foreach (var item in model.Languages)
                    {
                        var language = user.Languages.SingleOrDefault(x => x.Id == item.Id);
                        if (language == null)
                        {
                            language = new UserLanguage
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }
                        UpdateLanguageFromView(item, language);
                        newLanguage.Add(language);
                    }

                    user.Languages = newLanguage;

                    var newSkill = new List<UserSkill>();
                    foreach (var item in model.Skills)
                    {
                        var skill = user.Skills.SingleOrDefault(x => x.Id == item.Id);
                        if (skill == null)
                        {
                            skill = new UserSkill
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }
                        UpdateSkillFromView(item, skill);
                        newSkill.Add(skill);
                    }
                    user.Skills = newSkill;

                    var newExperience = new List<UserExperience>();
                    foreach (var item in model.Experience)
                    {
                        var experience = user.Experience.SingleOrDefault(x => x.Id == item.Id);
                        if (experience == null)
                        {
                            experience = new UserExperience
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                            };
                        }
                        UpdateExperienceFromView(item, experience);
                        newExperience.Add(experience);
                    }
                    user.Experience = newExperience;

                    await _userRepository.Update(user);
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
            //Your code here;
            //throw new NotImplementedException();
        }
        protected void UpdateLanguageFromView(AddLanguageViewModel model, UserLanguage original)
        {
            original.LanguageLevel = model.Level;
            original.Language = model.Name;
        }
        protected void UpdateExperienceFromView(ExperienceViewModel model, UserExperience original)
        {
            original.Company = model.Company;
            original.Position = model.Position;
            original.Responsibilities = model.Responsibilities;
            original.Start = model.Start;
            original.End = model.End;
        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        //public async Task<string> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            //Your code here;
            //throw new NotImplementedException();
            //var fileExtension = Path.GetExtension(file.FileName);
            //List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            //if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            //{
            //    return false;
            //}

            //var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

            //if (profile == null)
            //{
            //    return false;
            //}

            //var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            //if (!string.IsNullOrWhiteSpace(newFileName))
            //{
            //    var oldFileName = profile.ProfilePhoto;
            //    if (!string.IsNullOrWhiteSpace(oldFileName))
            //    {
            //        await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
            //    }

            //    profile.ProfilePhoto = newFileName;
            //    profile.ProfilePhotoUrl = await _fileService.GetFileURLToUpdate(newFileName, FileType.ProfilePhoto);

            //    await _userRepository.Update(profile);
            //    return true;

            //}
            //return false;
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _userRepository.Update(profile);
                return true;
            }

            return false;
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            //throw new NotImplementedException();
           
            try
            {
                    var profile = await _employerRepository.GetByIdAsync(employerOrJobId);
                    var userList = _userRepository.Collection.Skip(position).Take(increment).AsEnumerable();
                    if (profile != null)
                    {
                        var result = new List<TalentSnapshotViewModel>();

                        foreach (var user in userList)
                        {
                            var skills = new List<string>();
                            foreach (var skill in user.Skills)
                            {
                                skills.Add(skill.Skill);
                            }

                            var newTalentSnapshot = new TalentSnapshotViewModel();
                                newTalentSnapshot.Id = user.Id;
                                newTalentSnapshot.Name = user.FirstName + " " + user.LastName;
                                newTalentSnapshot.PhotoId = user.ProfilePhotoUrl;
                                newTalentSnapshot.VideoUrl = user.VideoName;
                                newTalentSnapshot.CVUrl = user.CvName;
                                newTalentSnapshot.Summary = user.Summary;
                            if (user.Experience.Count > 0)
                            {
                                newTalentSnapshot.CurrentEmployment = user.Experience[0].Company;
                                newTalentSnapshot.Level = user.Experience[0].Position;
                            }
                                newTalentSnapshot.Visa = user.VisaStatus;
                                newTalentSnapshot.Skills = skills;

                            result.Add(newTalentSnapshot);
                        }
                        return result;
                    }
                    return null;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }
         
        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
