/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package javasimplestandaardisatie;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 *
 * @author Mario
 */
public class NormaliseerLabels {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws IOException {
        //normaliseerNaarPercentage();
        verzamelTotalenPerEmotie();
    }

    public static void verzamelTotalenPerEmotie() throws IOException {

        List<Double> array1 = new ArrayList<>();
        List<Double> array2 = new ArrayList<>();

        for (int i = 0; i <= 15; i++) {
            array1.add(0.0);
            array2.add(0.0);
        }

        //Opgewonden,Zelfverzekerd,Dankbaar,Opgelucht,Bewondering,Trots,Bezorgd,Beschaamd,Vermoeid,Wanhopig,Moedeloos,Onbegrip,Onzeker,Ongerust,Gefrustreerd,Afschuw
        String endString = "";
        File folder = new File("/path/to/files");
        File[] listOfFiles = folder.listFiles();
        StringBuilder stringBuilderBin = new StringBuilder();
        File dir_read = new File("C:\\Users\\Mario\\Desktop\\Data-CNN\\Label");
        String dir_write_percentage = "C:\\Users\\Mario\\Desktop\\Data-CNN\\Label_Correct\\";
        String dir_write_bin = "C:\\Users\\Mario\\Desktop\\Data-CNN\\Label_Bin\\";
        File[] files = dir_read.listFiles();
        for (File file : files) {
            StringBuilder stringBuilderPercentage = new StringBuilder();

            double totaal = 0;
            String t_text = new String(Files.readAllBytes(file.toPath()), StandardCharsets.UTF_8);

//            if (t_text.contains(search_string)) {
//                // do whatever you want
//            }
            String[] split = t_text.split(" ; ");
            if (!split[1].contains(":")) {
                continue;
            }

            for (String splitted : split) {
                String[] split_splitted = splitted.split(" : ");
                totaal += Double.parseDouble(split_splitted[1]);
            }

            for (int i = 0; i < split.length; i++) {
                String[] split_splitted = split[i].split(" : ");
                int bin = Integer.parseInt(split_splitted[1]) > 0 ? 1 : 0;
                double percentage = Double.parseDouble(split_splitted[1]) / totaal;
                stringBuilderPercentage.append(percentage).append(" ; ");
                double temp = array1.get(i);
                array1.set(i, temp + bin);

                double boop = array2.get(i);
                array2.set(i, boop + percentage);

            }

            for (String splitted : split) {
                String[] split_splitted = splitted.split(" : ");
                double percentage = Double.parseDouble(split_splitted[1]) / totaal;
                stringBuilderPercentage.append(percentage).append(" ; ");

                int bin = Integer.parseInt(split_splitted[1]) > 0 ? 1 : 0;
                stringBuilderBin.append(bin).append(",");

            }

            //laatste ";" verwijderen
            stringBuilderBin.deleteCharAt(stringBuilderBin.length() - 1);
            /*stringBuilderBin.deleteCharAt(stringBuilderBin.length()-1);
            stringBuilderBin.deleteCharAt(stringBuilderBin.length()-1);*/
            stringBuilderPercentage.deleteCharAt(stringBuilderPercentage.length() - 1);
            stringBuilderPercentage.deleteCharAt(stringBuilderPercentage.length() - 1);
            stringBuilderPercentage.deleteCharAt(stringBuilderPercentage.length() - 1);

            stringBuilderBin.append("\n");
        }

        endString += stringBuilderBin.append("\n");

        System.out.printf("\tOpgewonden,\tZelfverzekerd,\tDankbaar,\tOpgelucht,\tBewondering,\tTrots,    \tBezorgd,\tBeschaamd,\tVermoeid,\tWanhopig,\tMoedeloos,\tOnbegrip,\tOnzeker,\tOngerust,\tGefrustreerd,\tAfschuw \n");

        int totaal = 0;

//            System.out.println(array1);
        for (Double integer : array1) {
            totaal += integer;
        }
            for (int i = 0; i < array1.size(); i++) {
                double temp = array1.get(i);
                System.out.printf("\t%.2f,\t ", temp/totaal*100);
                
                if(i==15){
                    System.out.println("");
                }
         }

        for (Double e : array2) {
            System.out.printf("\t%.2f,\t ", e);
        }

    }

    public static void normaliseerNaarPercentage() throws IOException {

        StringBuilder stringBuilderBin = new StringBuilder().append("Id,Opgewonden,Zelfverzekerd,Dankbaar,Opgelucht,Bewondering,Trots,Bezorgd,Beschaamd,Vermoeid,Wanhopig,Moedeloos,Onbegrip,Onzeker,Ongerust,Gefrustreerd,Afschuw").append("\n");      
        File dir_read = new File("Data-CNN\\Label");
        String dir_write_percentage = "Data-CNN\\Label_Correct\\";
        String dir_write_bin = "Data-CNN\\Label_Bin\\";
        File[] files = dir_read.listFiles();
        double totaal = 0;
        StringBuilder stringBuilderPercentage = new StringBuilder().append("Id,Opgewonden,Zelfverzekerd,Dankbaar,Opgelucht,Bewondering,Trots,Bezorgd,Beschaamd,Vermoeid,Wanhopig,Moedeloos,Onbegrip,Onzeker,Ongerust,Gefrustreerd,Afschuw").append("\n");
        for (File file : files) {
            String filenaam = file.getName();
            String t_text = new String(Files.readAllBytes(file.toPath()), StandardCharsets.UTF_8);
            String[] split = t_text.split(" ; ");
            if (!split[1].contains(":")) {
                continue;
            }
            for (String splitted : split) {
                String[] split_splitted = splitted.split(" : ");
                totaal += Double.parseDouble(split_splitted[1]);
            }
            stringBuilderPercentage.append(filenaam.replace(".txt", ","));
            for (String splitted : split) {
                String[] split_splitted = splitted.split(" : ");
                double percentage = Math.round(Double.parseDouble(split_splitted[1]) / totaal * 100);
                percentage = percentage / 100;
                stringBuilderPercentage.append(percentage).append(",");
                int bin = Integer.parseInt(split_splitted[1]) > 0 ? 1 : 0;
            }
            PrintWriter writer1 = new PrintWriter(dir_write_percentage + filenaam, "UTF-8");
            writer1.println(stringBuilderPercentage);
            writer1.close();
            stringBuilderPercentage.append("\n");
        }
        PrintWriter writer4 = new PrintWriter("Data-CNN\\LabelsPer.csv", "UTF-8");
        writer4.println(stringBuilderPercentage);
        writer4.close();
    }

}
