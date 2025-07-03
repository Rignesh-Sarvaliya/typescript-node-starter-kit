import { Request, Response } from "express";
import { ExportUserParamSchema } from "../../requests/admin/export.request";
import { getAllUsersForExport } from "../../repositories/user.repository";
import { logUserExport } from "../../jobs/export.jobs";
import { Parser } from "json2csv";
import XLSX from "xlsx";
import { captureError } from "../../telemetry/sentry";

export const exportUsersHandler = async (req: Request, res: Response) => {
  try {
    const { type } = ExportUserParamSchema.parse(req.params);
    const users = await getAllUsersForExport();

    const fileName = `users_export_${new Date()
      .toISOString()
      .slice(0, 10)}.${type}`;

    if (type === "csv") {
      const parser = new Parser();
      const csv = parser.parse(users);
      // res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      // res.setHeader("Content-Type", "text/csv");
      logUserExport("csv");
      return res.send(csv);
    }

    if (type === "xlsx") {
      const ws = XLSX.utils.json_to_sheet(users);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Users");
      const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
      // res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      // res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      logUserExport("xlsx");
      return res.send(buffer);
    }

    return res.status(400).json({ message: "Unsupported export type" });
  } catch (error) {
    captureError(error, "exportUsers");
    return res.status(500).json({ message: "Failed to export users" });
  }
};
