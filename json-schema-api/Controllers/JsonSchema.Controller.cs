using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;

[ApiController]
[Route("api/[controller]")]
public class JsonSchemaController : ControllerBase
{
    private readonly string storageRootPath = Path.Combine(Directory.GetCurrentDirectory(), "Storage");

    [HttpPost]
    public async Task<IActionResult> SaveSchema([FromBody] JsonSchemaModel model)
    {
        if (model == null || string.IsNullOrEmpty(model.Schema) || string.IsNullOrEmpty(model.Configuration))
        {
            return BadRequest("Invalid input data.");
        }

        var id = Guid.NewGuid().ToString();

        var path = Path.Combine(storageRootPath, id);

        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        var schemaPath = Path.Combine(path, "schema.json");
        var configPath = Path.Combine(path, "config.json");

        await System.IO.File.WriteAllTextAsync(schemaPath, model.Schema);
        await System.IO.File.WriteAllTextAsync(configPath, model.Configuration);

        return new OkObjectResult(new
        {
            Message = "Schema and configuration saved successfully."
        });
    }

    [HttpGet]
    public IActionResult GetSchemaList()
    {
        if (!Directory.Exists(storageRootPath))
        {
            return Ok(new List<string>());
        }

        var ids = Directory.GetDirectories(storageRootPath).Select(Path.GetFileName).ToList();
        var result = new List<object>();

        foreach (var id in ids)
        {
            var schemaPath = Path.Combine(storageRootPath, id, "schema.json");
            var configPath = Path.Combine(storageRootPath, id, "config.json");

            if (System.IO.File.Exists(schemaPath) && System.IO.File.Exists(configPath))
            {
                var schema = System.IO.File.ReadAllText(schemaPath);
                var config = System.IO.File.ReadAllText(configPath);
                result.Add(new
                {
                    Id = id,
                    Schema = schema,
                    Configuration = config
                });
            }
        }

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSchemaById(string id)
    {
        var schemaPath = Path.Combine(storageRootPath, id, "schema.json");
        var configPath = Path.Combine(storageRootPath, id, "config.json");

        if (!System.IO.File.Exists(schemaPath) || !System.IO.File.Exists(configPath))
        {
            return NotFound("Schema or configuration not found.");
        }

        var schema = await System.IO.File.ReadAllTextAsync(schemaPath);
        var config = await System.IO.File.ReadAllTextAsync(configPath);

        var result = new JsonSchemaModel
        {
            Schema = schema,
            Configuration = config
        };

        return Ok(result);
    }

    [HttpPost("{id}")]
    public async Task<IActionResult> ValidateDataAgainstSchema(string id, [FromBody] ValidationRequest request)
    {
        var validationErrors = new List<CustomValidationError>();

        if (id == null || string.IsNullOrEmpty(request?.Data))
        {
            return BadRequest("Invalid input data.");
        }

        var schemaPath = Path.Combine(storageRootPath, id, "schema.json");
        var configPath = Path.Combine(storageRootPath, id, "config.json");

        if (!System.IO.File.Exists(schemaPath) || !System.IO.File.Exists(configPath))
        {
            return NotFound("Schema or configuration not found.");
        }

        var schemaJson = await System.IO.File.ReadAllTextAsync(schemaPath);
        var configJson = await System.IO.File.ReadAllTextAsync(configPath);

        JSchema schema = JSchema.Parse(schemaJson);
        JObject json = JObject.Parse(request.Data);

        // Validate the JSON data against the schema
        var schemaValidationSucceeded = json.IsValid(schema, out IList<ValidationError> schemaErrors);

        var formattedSchemaValidationErrors = SchemaValidator.ToCustomValidationErrors(schemaErrors);

        var customErrors = CustomValidator.Validate(
            JObject.Parse(request.Data),
            JObject.Parse(configJson));

        validationErrors.AddRange(formattedSchemaValidationErrors);
        validationErrors.AddRange(customErrors);

        if (validationErrors.Count > 0)
        {
            return BadRequest(new
            {
                Message = "Validation failed!",
                Errors = validationErrors
            });
        }

        return Ok(new { Message = "Validation successful." });
    }
}
