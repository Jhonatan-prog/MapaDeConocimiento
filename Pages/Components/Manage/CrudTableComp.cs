using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MapaDeConocimiento.Pages.Components.Manage
{
    public class TableModelBackend : PageModel
    {
        public string Title { get; set; }
        public string[] Fields { get; set; }

        public void OnGet()
        {
            Title = "Home";
            Fields = new[] { "Column a", "Column b", "Column 4", "Column d" };
        }
    }
}
