package com.zetsubou_0.wallpaper.core;

import com.sun.jna.Native;
import com.sun.jna.platform.win32.WinDef.UINT_PTR;
import com.sun.jna.win32.*;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;

/**
 * Created by zetsubou_0 on 06.05.15.
 */
public class WallpaperChangerWindows implements WallpaperChanger {
    private static final String LIB_NAME = "user32";
    private static final String PATH = "c:\\Documents and Settings\\Public\\Pictures\\desktop.img";

    @Override
    public void changeWallpaper(String path) {
        System.loadLibrary(LIB_NAME);
        copyToSystem(path);


        SPI.INSTANCE.SystemParametersInfo(
                new UINT_PTR(SPI.SPI_SETDESKWALLPAPER),
                new UINT_PTR(0),
                PATH,
                new UINT_PTR(SPI.SPIF_UPDATEINIFILE | SPI.SPIF_SENDWININICHANGE));
    }

    public interface SPI extends StdCallLibrary {
        //from MSDN article
        static final long SPI_SETDESKWALLPAPER = 20;
        static final long SPIF_UPDATEINIFILE = 0x01;
        static final long SPIF_SENDWININICHANGE = 0x02;

        SPI INSTANCE = (SPI) Native.loadLibrary("user32", SPI.class, new HashMap() {
            {
                put(OPTION_TYPE_MAPPER, W32APITypeMapper.UNICODE);
                put(OPTION_FUNCTION_MAPPER, W32APIFunctionMapper.UNICODE);
            }
        });

        boolean SystemParametersInfo(
                UINT_PTR uiAction,
                UINT_PTR uiParam,
                String pvParam,
                UINT_PTR fWinIni
        );
    }

    private void copyToSystem(String from) {

        try(BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(new File(PATH)));
            BufferedInputStream in = new BufferedInputStream(new URL(from).openConnection().getInputStream())) {
            int read = 0;
            byte[] bytes = new byte[1024];

            while ((read = in.read(bytes)) != -1) {
                out.write(bytes, 0, read);
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
