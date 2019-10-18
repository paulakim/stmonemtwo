using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Talent.Common.Aws;
using Talent.Common.Contracts;

namespace Talent.Common.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        //private readonly string _tempFolder;
        private readonly string _bucketName;

        private IAwsService _awsService;

        public FileService(IHostingEnvironment environment, 
            IAwsService awsService)
        {
            _environment = environment;
            //_tempFolder = "images\\";
            _bucketName = "talent-photo";
            _awsService = awsService;
        }

        //public async Task<string> GetFileURL(string id, FileType type)
        //{
        //    //Your code here;
        //    //throw new NotImplementedException();
        //    //string fileURL = await Task.Run(() => {
        //    //    //return string.Join("/", "http://localhost:60290/images", id);
        //    //    return string.Join("/", id);
        //    //});

        //    //return fileURL;
        //    var url = "http://localhost:60290/images/" + id;
        //    return url;
        //}
        public async Task<string> GetFileURLToUpdate(string id, FileType type)
        {
            //Your code here;
            //throw new NotImplementedException();
            string fileURL = await Task.Run(() =>
            {
                return string.Join("/", "http://localhost:60290/images", id);
                //return string.Join("/", id);
            });

            return fileURL;
        }
        //public async Task<string> SaveFile(IFormFile file, FileType type)
        //{
        //    //Your code here;
        //    //throw new NotImplementedException();
        //    //var uploads = Path.Combine(_environment.ContentRootPath, _tempFolder);
        //    //var fileName = string.Empty;
        //    //var newFileName = string.Empty;

        //    ////Getting FileName
        //    //fileName = System.Net.Http.Headers.ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');

        //    ////Assigning Unique Filename (Guid)
        //    //var myUniqueFileName = Convert.ToString(Guid.NewGuid());

        //    ////Getting file Extension
        //    //var FileExtension = Path.GetExtension(fileName);

        //    //// concating  FileName + FileExtension
        //    //newFileName = myUniqueFileName + FileExtension;

        //    //try
        //    //{
        //    //    if (file.Length > 0)
        //    //    {
        //    //        var filePath = Path.Combine(uploads, newFileName);
        //    //        using (var fileStream = new FileStream(filePath, FileMode.Create))
        //    //        {
        //    //            // Save the file
        //    //            await file.CopyToAsync(fileStream);
        //    //        }

        //    //    }
        //    //    // return file.FileName;
        //    //    return newFileName;
        //    //}
        //    //catch (Exception ex)
        //    //{
        //    //    throw new Exception(ex.ToString());
        //    //    // return null;
        //    //}
        //    if (file==null||file.Length==0)
        //    {
        //        return null;
        //    }
        //    var path = Path.Combine(Directory.GetCurrentDirectory(), _tempFolder, file.FileName);
        //    using (var stream= new FileStream(path,FileMode.Create))
        //    {
        //        await file.CopyToAsync(stream);
        //    }
        //    return file.FileName;
        //}

        //public async Task<bool> DeleteFile(string id, FileType type)
        //{
        //    //Your code here;
        //    //throw new NotImplementedException();
        //    var imagesFolderPath = Path.Combine(_environment.ContentRootPath, _tempFolder);
        //    var filePath = Path.Combine(_tempFolder, id);

        //    try
        //    {
        //        if (File.Exists(filePath))
        //        {
        //            await Task.Run(() =>
        //            {
        //                File.Delete(filePath);
        //                return true;
        //            });
        //        }
        //        return false;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception(ex.ToString());
        //        //return false;
        //    }
        //}


        public async Task<string> GetFileURL(string fileName, FileType type)
        {
            //Your code here;
            //string fileURL = await Task.Run(() => string.Join("/", "http://localhost:60290/images", id));
            //return fileURL;
            //var fileUrl = "";
            //string pathWeb = _environment.ContentRootPath;

            //if (id != null && type == FileType.ProfilePhoto)
            //{
            //    fileUrl = await Task.Run(() => string.Join("/", "http://localhost:60290/images", id));
            //}
            //return fileUrl;

            return await _awsService.GetStaticUrl(fileName, _bucketName);
        }

        public async Task<string> SaveFile(IFormFile file, FileType type)
        {
            //Your code here;
            //var uniqueName = Convert.ToString(Guid.NewGuid());
            //var extension = Path.GetExtension(file.FileName);
            //var newFileName = uniqueName + extension;

            //if (file.Length > 0)
            //{
            //    var filePath = Path.Combine(_environment.ContentRootPath, _tempFolder, newFileName);
            //    using (var fileStream = new FileStream(filePath, FileMode.Create))
            //    {
            //        await file.CopyToAsync(fileStream);
            //    }
            //}
            //return newFileName;
            string fileName = null;
            if (file != null && type == FileType.ProfilePhoto)
            {
                fileName = $@"img{DateTime.Now.Ticks}";
                var result = await _awsService.PutFileToS3(fileName, file.OpenReadStream(), _bucketName, true);
                if (!result) fileName = null;
            }
            return fileName;
        }

        public async Task<bool> DeleteFile(string fileName, FileType type)
        {
            //Your code here;
            //var imagesFolderPath = Path.Combine(_environment.ContentRootPath, _tempFolder);
            //var filePath = Path.Combine(_tempFolder, id);

            //if (File.Exists(filePath))
            //{
            //    await Task.Run(() =>
            //    {
            //        File.Delete(filePath);
            //        return true;
            //    });
            //}
            //return false;
            return await _awsService.RemoveFileFromS3(fileName, _bucketName);
        }



        #region Document Save Methods

        private async Task<string> SaveFileGeneral(IFormFile file, string bucket, string folder, bool isPublic)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        
        private async Task<bool> DeleteFileGeneral(string id, string bucket)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        #endregion
    }
}
